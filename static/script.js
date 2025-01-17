const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const usernameDialog = document.getElementById("username-dialog")
const progressDialog = document.getElementById("progress-dialog");
const usernameAlreadyExists = document.getElementById("username-already-taken-error");
const successDialog = document.getElementById("success-dialog");
const shareButtonSnackbar = document.getElementById("share_button_snackbar");
const apiKeyCopiedSnackbar = document.getElementById("api-key-copied");
const userAccountDialog = document.getElementById("user-account-dialog");
const progressDialogText = document.getElementById("progress-dialog-text");
const usernameLoginInput = document.getElementById("login-username-input");
const apikeyLoginInput = document.getElementById("login-api-key-input");
const loginDialog = document.getElementById("login-dialog");
const failedToLogin = document.getElementById("failedToLogin");
const deletedAccountSnackbar = document.getElementById("deleted-account");
const aboutDialog = document.getElementById("about-dialog");
const goDownButton = document.getElementById("go-down-button");
const messageNav = document.getElementById("message-nav");
const mainView = document.getElementById("main");
const header = document.getElementById("header");
const baseUrl = window.location.protocol+ "//"+ window.location.host + "/"

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    console.log("decoding cookie: ", ca);
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim(); // Use trim() to remove leading/trailing spaces
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }

    // Cookie not found, return an empty string
    console.log("cookie: ", ca, " not found");
    return "";
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function checkUsernameDialog() {

    progressDialogText.innerText = "Checking username availability...";
    progressDialog.classList.add("active");
    usernameDialog.classList.remove("active");
    usernameAlreadyExists.classList.remove("active");

    setTimeout(function () {
        const username = document.getElementById("username-input").value;
        const endpoint = baseUrl + "users"; // The server endpoint
        console.log(username);

        fetch(endpoint, {
            method: "POST", // HTTP method
            headers: {
                "Content-Type": "application/json", // Indicates JSON payload
            }, body: JSON.stringify({"username": username}), // Send the string in the request body
        })
            .then(async response => {
                let parsed_data;
                if (response.status === 201) {
                    parsed_data = JSON.parse(await response.text())
                    successDialog.classList.add("active");
                    setTimeout(function () {
                        successDialog.classList.remove("active")
                        console.log("remove success dialog")
                    }, 1500);
                    usernameDialog.classList.remove("active");
                    console.log("remove username dialog")

                    setCookie("username", parsed_data["username"]);
                    setCookie("user_id", parsed_data["user_id"]);

                } else if (response.status === 409) {
                    progressDialog.classList.remove("active");
                    usernameDialog.classList.add("active");
                    usernameAlreadyExists.classList.add("active");
                    setTimeout(function () {
                        usernameAlreadyExists.classList.remove("active");
                    }, 3000);

                } else {
                    console.log(`HTTP error! status: ${response.status}`);
                }
                progressDialog.classList.remove("active");

            })
            .then(data => {
                console.log("Response from server:", data); // Handle the server's response
            })
            .catch(error => {
                console.error("Error:", error); // Handle any errors
                usernameDialog.classList.add("active");
            });
        progressDialog.classList.remove("active");
    }, 1500);


}

function messageElementGenerator(username, message) {
    element = document.createElement('article');

    element.innerHTML = `<div class="column"  style="border-radius: 0">
                            <div class="row">
                                <i class="circle large" style="transform: scale(1.5);margin: 0.25em">account_circle</i>
                                <h5 class="message-user">${username}</h5>
                            </div>
                            <p class="message-text" >${message}</p>
                        </div>`;
    element.classList.add('message');
    element.classList.add('bottom-round');
    element.classList.add('right-round');
    element.classList.add('secondary-container');
    return element;
}

function selfMessageElementGenerator(message) {
    element = document.createElement('article');
    element.innerHTML = `<div class="row">
                            <div class="max">
                                <p class="message-text">${message}</p>
                            </div>
                        </div>`;
    element.classList.add('message');
    element.classList.add('bottom-round');
    element.classList.add('left-round');
    element.classList.add('tertiary-container');
    element.classList.add('self');
    return element;
}

function addMessage(message_sender, message) {
    const username = getCookie("username")
    message = HtmlSanitizer.SanitizeHtml(message);
    if (message === "") {
        return;
    }
    console.log("add message from:", username)
    let element;
    if (message_sender === username) element = selfMessageElementGenerator(message); else element = messageElementGenerator(message_sender, message)

    chatBox.appendChild(element);
    scrollToBottom();
}

function sendMessage() {
    console.log('Sending message');
    const username = getCookie('username');
    const user_id = getCookie('user_id');
    const message = messageInput.value.trim();

    console.log("user_id: ", user_id, "username:", username);
    if (username === "" || user_id === "") {
        console.log('User must be logged in to send message');
        usernameDialog.classList.add('active');
        return;
    }

    const chatMessage = {
        username: username, message: message, user_id: user_id,
    };
    socket.send(JSON.stringify(chatMessage));
    messageInput.value = ''; // Clear the input field
}

function loadMessages() {
    let request = new XMLHttpRequest();
    request.open('GET', '/messages', false);
    request.send();

    let messages = JSON.parse(request.response);

    for (let message in messages) {
        addMessage(messages[message].username, messages[message].message)
    }
    console.log("Messages loaded");

}

function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
    console.log("Scrolled to bottom");
    goDownButton.classList.remove("active");

}

function shareButton() {
    shareButtonSnackbar.classList.add("active");
    setTimeout(function () {
        shareButtonSnackbar.classList.remove("active");
    }, 2000)
    navigator.clipboard.writeText(baseUrl);

}

function copyApiKey() {
    apiKeyCopiedSnackbar.classList.add("active");
    setTimeout(function () {
        apiKeyCopiedSnackbar.classList.remove("active");
    }, 2000)
    navigator.clipboard.writeText(getCookie("user_id"));
}
let socket
function openSocket() {
    if (window.location.protocol === 'http:') {
        socket = new WebSocket(`ws://${window.location.host}/ws`);
    } else {
        socket = new WebSocket(`wss://${window.location.host}/ws`);
    }
    socket.onopen = () => {
        console.log('Connected to the WebSocket server');
    };
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message: ', message);

        addMessage(message.username, message.message);
        scrollToBottom();

    };
    socket.onclose = () => {
        console.log('Disconnected from the WebSocket server ... trying to reconect in 0.5 second');
        setTimeout(function () {
            openSocket();
        }, 500)
    };
}

function isScrolledToBottom(obj) {
    if (obj.scrollTop+10 < (obj.scrollHeight - obj.offsetHeight)) {
        goDownButton.classList.add("active")
    } else {
        goDownButton.classList.remove("active");
    }
}

function chatBoxResize(){
    let headerHeight = parseFloat(window.getComputedStyle(header).height)
    if(!window.matchMedia("(max-width: 600px)").matches) {
        console.log("matches matches");
        headerHeight = 0
    }
    let height= window.innerHeight - parseFloat(window.getComputedStyle(messageNav).height) - headerHeight - 100;
    console.log("height:", height);
    console.log("style:", window.getComputedStyle(mainView).height);
    chatBox.style.height = height+"px";
}

chatBox.onscroll = function () {
    isScrolledToBottom(chatBox)
}
window.onresize = function () {
    chatBoxResize();
}

openSocket();
loadMessages();
chatBoxResize();
scrollToBottom();



messageInput.addEventListener('keypress', function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function onUserAccountClick() {
    if (getCookie("user_id") !== "") {
        document.getElementById("user-account-dialog-span").innerText = getCookie("username");
        userAccountDialog.classList.add("active");
    } else {
        usernameDialog.classList.add('active')
    }
}

function loginButton() {
    let username = usernameLoginInput.value.trim();
    let apikey = apikeyLoginInput.value.trim();
    progressDialogText.innerText = "Logging in ...";
    progressDialog.classList.add("active");
    const endpoint = baseUrl + "users"
    setTimeout(function () {
            fetch(endpoint, {
                method: "POST", // HTTP method
                headers: {
                    "Content-Type": "application/json", // Indicates JSON payload
                }, body: JSON.stringify({"username": username, "user_id": apikey}), // Send the string in the request body
            })
                .then(async response => {
                    let parsed_data;
                    if (response.status === 202) {
                        loginDialog.classList.remove("active");
                        userAccountDialog.classList.remove("active");
                        usernameDialog.classList.remove("active");
                        successDialog.classList.add("active");
                        setCookie("username", username);
                        setCookie("user_id", apikey);
                        console.log("remove login dialog")

                        setTimeout(function () {
                            successDialog.classList.remove("active")
                            console.log("remove success dialog")
                        }, 1500);


                    } else if (response.status === 401) {
                        progressDialog.classList.remove("active");
                        loginDialog.classList.add("active");
                        failedToLogin.classList.add("active");
                        setTimeout(function () {
                            failedToLogin.classList.remove("active");
                        }, 3000);

                    } else {
                        console.log(`HTTP error! status: ${response.status}`);
                    }

                })
                .then(data => {
                    console.log("Response from server:", data); // Handle the server's response
                })
                .catch(error => {
                    console.error("Error:", error); // Handle any errors
                    usernameDialog.classList.add("active");
                });
            progressDialog.classList.remove("active");
            successDialog.classList.remove("active");
        }
        , 1500)
}

function deleteAccount() {
    let username = getCookie("username");
    let apikey = getCookie("user_id");
    const endpoint = baseUrl + "users"

    progressDialogText.innerText = "Deleting Account...";
    progressDialog.classList.add("active");

    fetch(endpoint, {
        method: "DELETE", // HTTP method
        headers: {
            "Content-Type": "application/json", // Indicates JSON payload
        }, body: JSON.stringify({"username": username, "user_id": apikey}), // Send the string in the request body
    }).then(async response => {
        if (response.status === 204) {
            setTimeout(function () {
                progressDialog.classList.remove("active");
                deletedAccountSnackbar.classList.add("active");
                setTimeout(function () {
                    deletedAccountSnackbar.classList.remove("active");
                }, 3000)
                progressDialog.classList.remove("active");
                successDialog.classList.remove("active");
                loginDialog.classList.remove("active");
                userAccountDialog.classList.remove("active");
            }, 1500)
            setCookie("username", "", 0);
            setCookie("user_id", "", 0);
        } else {
            console.log(`HTTP error! status: ${response.status}`);
            progressDialog.classList.remove("active");
            successDialog.classList.remove("active");
            loginDialog.classList.remove("active");
            userAccountDialog.classList.remove("active");
        }
    })
}