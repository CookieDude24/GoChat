<script lang="ts">
    import {onMount, tick} from "svelte";
    import {User} from './Global.svelte.ts';

    import {dev} from "$app/environment";
    import {getCookie} from "./Global.svelte";
    import {goto} from "$app/navigation";

    let messages: { username: string; message: string }[] = $state([]);

    onMount(() => {
        openSocket();
        loadMessages()
            .then((loadedMessages) => {
                messages = loadedMessages; // Set messages to display
            })
            .catch((error) => {
                console.error("Error loading messages:", error);
            });
    });
    let socket: any;

    function openSocket() {
        if (dev) {
            socket = new WebSocket(`ws://localhost:8080/ws`);
        } else {
            socket = new WebSocket(`wss://${window.location.host}/ws`);
        }
        socket.onopen = () => {
            console.log("Connected to the WebSocket server");
        };
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("sSReceived message: ", message);
            messages = [...messages, message]; // Append new message
        };
        socket.onclose = () => {
            console.log(
                "Disconnected from the WebSocket server ... trying to reconnect in 0.5 second"
            );
            setTimeout(() => {
                openSocket();
            }, 500);
        };
    }

    function loadMessages() {
        let url = "/messages";
        if (dev) {
            url = "http://localhost:8080/messages";
        }

        return fetch(url, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // Parse and return the JSON response
            })
            .catch((error) => {
                console.error("Failed to load messages:", error);
                throw error; // Re-throw the error for further handling
            });
    }

    let chatContainer: HTMLElement;
    $effect.pre(() => {
        messages;
        const autoscroll = chatContainer && chatContainer.offsetHeight + chatContainer.scrollTop > chatContainer.scrollHeight - 50;

        if (autoscroll) {
            tick().then(() => {
                chatContainer.scrollTo(0, chatContainer.scrollHeight);
            });
        }
    })

    // function isScrolledToBottom(obj) {
    //     if (obj.scrollTop+10 < (obj.scrollHeight - obj.offsetHeight)) {
    //         goDownButton.classList.add("active")
    //     } else {
    //         goDownButton.classList.remove("active");
    //     }
    // }
    let messageNav: HTMLElement;
    let mainView: HTMLElement;

    function chatBoxResize() {
        // let headerHeight = parseFloat(window.getComputedStyle(header).height)
        // let headerHeight;
        // if(!window.matchMedia("(max-width: 600px)").matches) {
        //     headerHeight = 100
        // }else {
        //     headerHeight = 0
        // }
        let height = window.innerHeight - parseFloat(window.getComputedStyle(messageNav).height) - 50;
        console.log("height:", height);
        console.log("style:", window.getComputedStyle(mainView).height);
        chatContainer.style.height = height + "px";
    }

    // chatBox.onscroll = function () {
    //     isScrolledToBottom(chatBox)
    // }
    window.onresize = function () {
        chatBoxResize();
    }

    let messageInput: string;
    let messageTextInput: HTMLInputElement;

    async function sendMessage() {
        console.log('Sending message');
        const user = new User();
        if (!await user.validateLogin()) {
            goto('/signup')
            return
        }


        const message = messageInput;

        console.log("user_id: ", user.apikey, "username:", user.username);


        const chatMessage = {
            username: user.username, message: message, user_id: user.apikey,
        };
        socket.send(JSON.stringify(chatMessage));
        messageTextInput.value = ''
    }
    const onKeydown=(event: KeyboardEvent) =>{
        if (event.key === 'Enter') {
            sendMessage()
        }
    }
</script>

<main class="responsive fixed center middle" bind:this={mainView}>
    <div id="chatbox" bind:this={chatContainer}>
        {#if messages.length === 0}
            <h3 class="center-align middle">No messages yet...</h3>
        {:else}
            {#each messages as {username, message}}
                {#if username === getCookie('username')}
                    <article class="message bottom-round left-round border self">
                        <div class="column" style="border-radius: 0">
                            <div class="row">
                                <img class="circle large"
                                     alt="{username}'s profile picture"
                                     src="{dev ? 'http://localhost:8080' : ''}/icons/{username}.png">
                                <h5>You</h5>
                            </div>

                            <p class="message-text">{message}</p>
                        </div>
                    </article>
                {:else}
                    <article class="message bottom-round right-round secondary-container">
                        <div class="column" style="border-radius: 0">
                            <div class="row">
                                <img class="circle large"
                                     alt="{username}'s profile picture"
                                     src="{dev ? 'http://localhost:8080' : ''}/icons/{username}.png">
                                <h5>{username}</h5>

                            </div>
                            <p class="message-text">{message}</p>
                        </div>
                    </article>
                {/if}
            {/each}
        {/if}
    </div>
    <nav id="message-nav" bind:this={messageNav} class="center-align bottom-align"
         style="padding-bottom: min(1vh,3vw); flex-grow: 1">
        <div class="field label suffix border round fill large bottom fill" style="width:70%">
            <input type="text" bind:value={messageInput} bind:this={messageTextInput} onkeydown={onKeydown}>
            <label>Message</label>
        </div>
        <button class="square round small-elevate extra primary right" onclick="{sendMessage}">
            <i>send</i>
        </button>
    </nav>
</main>
<style>
    main {
        height: 100vh;
        width: 80%;
        display: flex;
        overflow-y: scroll;
        flex-direction: column;
    }

    .self {
        margin-left: auto;
        margin-right: 0;

    }

    #chatbox {
        flex-grow: 1;
        overflow-y: scroll;
        height: 90vh;
    }

    @media only screen and (max-width: 600px) {
        #message-nav {
            margin-top: 1em;
            margin-bottom: 10vh;

        }
    }

    #message-nav {
        overflow: visible;
        flex-grow: 1;
    }


</style>