package main

import (
	"database/sql"
	"encoding/json"
	"github.com/gorilla/websocket"
	"github.com/rrivera/identicon"
	"image"
	"image/png"
	_ "image/png"
	"io"
	"log"
	"math/rand"
	_ "modernc.org/sqlite"
	"net/http"
	"os"
	"time"
)

type Message struct {
	Username  string `json:"username"`
	UserID    string `json:"user_id"`
	Message   string `json:"message"`
	CreatedAt string `json:"created_at"`
	ChatRoom  string `json:"chat_room"`
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}
var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan Message)

var db *sql.DB

var dev_mode = os.Getenv("DEV_MODE")

var IconsPath = os.Getenv("ICONS_PATH")
var DbPath = os.Getenv("DB_PATH")
var HtmlPath = os.Getenv("HTML_PATH")

func randomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	seededRand := rand.New(rand.NewSource(time.Now().UnixNano()))
	result := make([]byte, length)
	for i := range result {
		result[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(result)
}

func main() {
	if dev_mode == "TRUE" {
		log.Println("Running in dev mode!")
		IconsPath = "./src/backend/icons"
		DbPath = "./src/backend/chat.db"
		HtmlPath = "./src/website/build"
	}

	var err error
	db, err = sql.Open("sqlite", DbPath)
	if err != nil {
		panic(err)
	}

	defer db.Close()

	// Create the users and messages table if it doesn't exist
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS users (
    username TEXT not null,
    user_id  TEXT not null PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`)
	if err != nil {
		panic(err)
	}
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS messages (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id TEXT not null,
	message TEXT not null,
	chatroom TEXT not null DEFAULT 'default',
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
	)`)
	if err != nil {
		panic(err)
	}

	createIconsForOldUsers(db)

	// File server and WebSocket handlers
	http.Handle("/", http.FileServer(http.Dir(HtmlPath)))
	http.Handle("/icons/", http.StripPrefix("/icons/", http.FileServer(http.Dir(IconsPath))))
	http.HandleFunc("/ws", handleConnections)
	http.HandleFunc("/messages", handleGetMessages)
	http.HandleFunc("/chatrooms", handleGetChatrooms)
	http.HandleFunc("/users", handleUsers)
	http.HandleFunc("/uploadicon", createImage)

	// Start message handling goroutine
	go handleMessages()

	log.Println("Listening on :8080")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		panic("Error starting server: " + err.Error())
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	if dev_mode == "TRUE" {
		enableCors(&w)
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	clients[conn] = true

	for {
		var msg Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Println(err)
			delete(clients, conn)
			return
		}

		if !UserAuthenticated(db, msg.Username, msg.UserID) {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}
		if len(msg.Message) == 0 {
			http.Error(w, "empty messages not allowed", http.StatusBadRequest)
			return
		}
		log.Println(msg.Username, "sent", msg.Message)

		if msg.ChatRoom == "" {
			msg.ChatRoom = "default"
		}

		// Save the message to the database
		_, err = db.Exec(`INSERT INTO messages (user_id, message, chatroom) VALUES (?, ?, ?)`, msg.UserID, msg.Message, msg.ChatRoom)
		if err != nil {
			log.Println("Error saving message to database:", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		msg.UserID = ""

		// Broadcast the message
		broadcast <- msg
	}
}

func handleMessages() {
	// Wait for a new message to be received on the broadcast channel
	for {
		msg := <-broadcast
		// Send the message to all connected clients
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Println("Error sending message:", err)
				client.Close()
				delete(clients, client) // Remove disconnected clients
			}
		}
	}
}
func handleGetChatrooms(w http.ResponseWriter, r *http.Request) {
	if dev_mode == "TRUE" {
		enableCors(&w)
	}
	rows, err := db.Query(`
		SELECT DISTINCT 
			messages.chatroom
		FROM 
			messages
	`)
	if err != nil {
		http.Error(w, "Error fetching messages", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var chatrooms []string
	for rows.Next() {
		var chatroom string
		// Scan all columns in the correct order
		err := rows.Scan(&chatroom)
		if err != nil {
			http.Error(w, "Error scanning messages", http.StatusInternalServerError)
			return
		}
		chatrooms = append(chatrooms, chatroom)
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(chatrooms)
	if err != nil {
		http.Error(w, "Error encoding messages", http.StatusInternalServerError)
	}
}
func handleGetMessages(w http.ResponseWriter, r *http.Request) {
	if dev_mode == "TRUE" {
		enableCors(&w)
	}
	rows, err := db.Query(`
		SELECT 
			users.username, 
			messages.message, 
			messages.chatroom,
			messages.created_at
		FROM 
			users
		JOIN 
			messages 
		ON 
    		users.user_id = messages.user_id;
	`)
	if err != nil {
		http.Error(w, "Error fetching messages", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var msg Message
		// Scan all columns in the correct order
		err := rows.Scan(&msg.Username, &msg.Message, &msg.ChatRoom, &msg.CreatedAt)
		if err != nil {
			http.Error(w, "Error scanning messages", http.StatusInternalServerError)
			return
		}
		messages = append(messages, msg)
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(messages)
	if err != nil {
		http.Error(w, "Error encoding messages", http.StatusInternalServerError)
	}
}
func handleUsers(w http.ResponseWriter, r *http.Request) {
	if dev_mode == "TRUE" {
		enableCors(&w)
	}

	if r.Method == "POST" {
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to read request body", http.StatusBadRequest)
			return
		}
		log.Println("Received POST request: ", string(body))
		var receivedData Message
		err = json.Unmarshal(body, &receivedData)
		if err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		// for login
		if receivedData.UserID != "" && receivedData.Username != "" {
			if UserAuthenticated(db, receivedData.Username, receivedData.UserID) {
				http.Error(w, "Authenticated", http.StatusAccepted)
				log.Println(receivedData.Username, "authenticated")
				return
			} else {
				http.Error(w, "Authentication Failed", http.StatusUnauthorized)
				log.Println(receivedData.Username, "authentication failed")
				return
			}
		}

		var username = receivedData.Username

		if username == "" {
			http.Error(w, "Invalid username", http.StatusBadRequest)
			return
		}
		if len(username) > 20 {
			http.Error(w, "Username too long", http.StatusBadRequest)
			return
		}

		log.Println("checking for '" + username + "' in database")

		if UserExists(db, username) {
			log.Println(username + " already exists")
			http.Error(w, "Username already exists", http.StatusConflict)
		} else {
			userId := randomString(16)
			generateIcon(username)
			_, err := db.Exec(`INSERT INTO users (user_id, username) VALUES (?, ?)`, userId, username)
			if err != nil {
				return
			}
			log.Println(username + " created")

			var user Message = Message{Username: username, UserID: userId, Message: "", CreatedAt: ""}
			user_encoded_json, err := json.Marshal(user)
			if err != nil {
				http.Error(w, "Error encoding user", http.StatusInternalServerError)
			}

			log.Println("sending Data: " + string(user_encoded_json))
			http.Error(w, string(user_encoded_json), http.StatusCreated)
		}
	}
	if r.Method == "DELETE" {

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to read request body", http.StatusBadRequest)
			return
		}

		log.Println(string(body))
		var receivedData Message
		err = json.Unmarshal(body, &receivedData)
		if err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		if !UserAuthenticated(db, receivedData.Username, receivedData.UserID) {
			http.Error(w, "Authentication Failed", http.StatusUnauthorized)
			return
		}

		if deleteUser(db, receivedData.Username, receivedData.UserID) {
			http.Error(w, "", http.StatusNoContent)
			_ = os.Remove("./icons/" + receivedData.Username + ".png")
		} else {
			http.Error(w, "Delete Failed", http.StatusInternalServerError)
		}
		log.Println("deleted user:", receivedData.Username)
		return
	}
	if r.Method == "PUT" {
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to read request body", http.StatusBadRequest)
			return
		}

		log.Println(string(body))
		var receivedData Message
		err = json.Unmarshal(body, &receivedData)
		if err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		if !UserAuthenticated(db, receivedData.Username, receivedData.UserID) {
			http.Error(w, "Authentication Failed", http.StatusUnauthorized)
			return
		}

		if renameUser(db, receivedData.Message, receivedData.Username, receivedData.UserID) {
			log.Println("renamed user ", receivedData.Username, "to", receivedData.Message)
			http.Error(w, "", http.StatusNoContent)
		} else {
			log.Println("failed to rename user ", receivedData.Username, "to", receivedData.Message)
			http.Error(w, "", http.StatusInternalServerError)
		}
		return
	}
}
func createIconsForOldUsers(db *sql.DB) {
	users := getUsers(db)
	log.Println(users)

	for _, user := range users {
		log.Println(user)
		if _, err := os.Stat(IconsPath + "/" + user + ".png"); err == nil {
			log.Print("icon already exists for ", user)
		} else {
			generateIcon(user)
		}
	}
}

func getUsers(db *sql.DB) []string {
	sqlStmt := `SELECT username FROM users`
	rows, err := db.Query(sqlStmt)
	if err != nil {
		if err != sql.ErrNoRows {
			log.Print(err)
			return nil
		}
	}
	defer rows.Close()
	var users []string
	for rows.Next() {
		var username string
		err = rows.Scan(&username)
		users = append(users, username)
	}
	return users
}
func UserExists(db *sql.DB, username string) bool {
	sqlStmt := `SELECT username FROM users WHERE username = ?`
	err := db.QueryRow(sqlStmt, username).Scan(&username)
	if err != nil {
		if err != sql.ErrNoRows {
			// TODO: a real error happened! you should change your function return
			// to "(bool, error)" and return "false, err" here
			log.Print(err)
			return false
		}

		return false
	}
	return true
}
func deleteUser(db *sql.DB, username string, userID string) bool {
	sqlStmt := `DELETE FROM users WHERE username = ? and user_id = ?`
	_, err := db.Exec(sqlStmt, username, userID)
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}
func UserAuthenticated(db *sql.DB, username string, userId string) bool {
	sqlStmt := `SELECT user_id, username FROM users WHERE username = ? and user_id = ?`

	err := db.QueryRow(sqlStmt, username, userId).Scan(&username, &userId)
	if err != nil {
		if err != sql.ErrNoRows {
			// TODO: a real error happened! you should change your function return
			// to "(bool, error)" and return "false, err" here
			log.Print(err)
			return false
		}
		log.Println("user not found")
		return false
	}
	log.Println(username, " authenticated")
	return true
}

func generateIcon(username string) {
	ig, err := identicon.New(
		"github", // Namespace
		7,        // Number of blocks (Size)
		3,        // Density,
	)

	if err != nil {
		panic(err)
	}

	ii, err := ig.Draw(username)

	if err != nil {
		panic(err)
	}

	img, _ := os.Create(IconsPath + "/" + username + ".png")
	defer img.Close()
	// Takes the size in pixels and any io.Writer
	ii.Png(300, img) // 300px * 300px
	log.Println("successfully generated icon for ", username)
}
func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
}
func createImage(w http.ResponseWriter, request *http.Request) {
	if dev_mode == "TRUE" {
		enableCors(&w)
	}

	err := request.ParseMultipartForm(32 << 20) // maxMemory 32MB
	if err != nil {
		log.Println("createImage: Unable to parse multipart form")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	username := request.FormValue("username")
	userID := request.FormValue("user_id")
	if !UserAuthenticated(db, username, userID) {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	file, _, err := request.FormFile("photo")
	if err != nil {
		log.Println("createImage: Unable to open file; error:", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	img, _, err := image.Decode(file)
	if err != nil {
		log.Println("createImage: Unable to decode file; error:", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	tmpfile, err := os.Create(IconsPath + "/" + username + ".png")
	defer tmpfile.Close()
	if err != nil {
		log.Println("createImage: Unable to create file; error:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	err = png.Encode(tmpfile, img)
	if err != nil {
		log.Println("createImage: Unable to encode file; error:", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Println("Successfully update profile picture for user", username)
	w.WriteHeader(200)
	return
}
func renameUser(db *sql.DB, newUsername string, oldUsername string, userid string) bool {
	if UserExists(db, newUsername) {
		log.Println("renameUser: User already exists")
		return false
	}
	_, err := db.Exec(`UPDATE users SET username = ? WHERE user_id = ?`, newUsername, userid)
	if err != nil {
		log.Println("renameUser: Unable to rename user; error:", err)
		return false
	}
	err = os.Rename(IconsPath+"/"+oldUsername+".png", IconsPath+"/"+newUsername+".png")
	if err != nil {
		log.Println("renameUser: Unable to rename file; error:", err)
		return false
	}
	return true
}
