const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const usernameDialog = document.getElementById("username-dialog")
const progressDialog = document.getElementById("progress-dialog");
const usernameAlreadyExists = document.getElementById("username-already-taken-error");
const successDialog = document.getElementById("success-dialog");

let lastOwnMessage = null;

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    console.log("Finished decoding cookie");
    console.log("cookie not found");
    if (cname === "username") {
        console.log("asking for username");
        usernameDialog.classList.add("active");
    }

}
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function checkUsernameDialog(){

    progressDialog.classList.add("active");
    usernameDialog.classList.remove("active");
    usernameAlreadyExists.classList.remove("active");

    setTimeout(function(){
        const username = document.getElementById("username-input").value;
        const endpoint = "http://localhost:8080/users"; // The server endpoint
        console.log(username);

        fetch(endpoint, {
            method: "POST", // HTTP method
            headers: {
                "Content-Type": "application/json", // Indicates JSON payload
            },
            body: JSON.stringify({"username": username}), // Send the string in the request body
        })
            .then(async response => {
                let parsed_data;
                if (response.status === 201) {
                    successDialog.classList.add("active");
                    setTimeout(function () {
                        successDialog.classList.remove("active")
                        console.log("remove success dialog")
                    }, 1000);
                    usernameDialog.classList.remove("active");
                    console.log("remove username dialog")
                    parsed_data = JSON.parse(await response.text())
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
    element.innerHTML = `<div class="row">
                            <img class="circle large" src="/beer-and-woman.svg">
                            <div class="max">
                                <h5 class="message-user">${username}</h5>
                                <p class="message-text">${message}</p>
                            </div>
                        </div>`;
    element.classList.add('message');
    element.classList.add('round');
    element.classList.add('secondary-container');
    return element;
}
function addMessage(username, message, self = false) {
    let element = messageElementGenerator(username, message)
    if (self) {
        element.classList.add('self');
        element.classList.remove('secondary-container');
        element.classList.add('tertiary-container');
    }
    chatBox.appendChild(element);
    scrollToBottom();
}
function sendMessage() {
    console.log('Sending message');
    const username = getCookie('username');
    const message = messageInput.value.trim();

    if (!message) {
        alert('Message cannot be empty.');
        return;
    }

    const chatMessage = {
        username: username,
        message: message,
    };
    lastOwnMessage = chatMessage;
    socket.send(JSON.stringify(chatMessage));
    messageInput.value = ''; // Clear the input field
    addMessage(chatMessage.username,chatMessage.message, true);
}

function loadMessages() {
    let request = new XMLHttpRequest();
    request.open('GET', '/messages', false);
    request.send();

    let messages = JSON.parse(request.response);

    for (let message in messages) {
        chatBox.appendChild(messageElementGenerator(messages[message].username, messages[message].message));
    }
    console.log("Messages loaded");

}

function scrollToBottom() {
    let oida= document.getElementById('chat-box');
    oida.scrollTop = oida.scrollHeight;
    console.log("Scrolled to bottom");
}

loadMessages();
scrollToBottom();



// Connect to the WebSocket server
const socket = new WebSocket(`ws://${window.location.host}/ws`);

socket.onopen = () => {
    console.log('Connected to the WebSocket server');
};

socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Received message');
    if(message.message === lastOwnMessage.message && message.username === lastOwnMessage.username) {
        console.log('Ignoring message since it\'s my own');
        lastOwnMessage = null;
    }else {
        addMessage(message.username, message.message,false);
        scrollToBottom();
    }
};

socket.onclose = () => {
    console.log('Disconnected from the WebSocket server');
};

messageInput.addEventListener('keypress', function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
