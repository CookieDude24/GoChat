<script lang="ts">
    import {onMount, tick} from "svelte";
    import {User} from './Global.svelte.ts';
    import {dev} from "$app/environment";
    import {getCookie} from "./Global.svelte";
    import {goto} from "$app/navigation";
    import {slide, blur} from "svelte/transition"
    import {linear} from "svelte/easing";


    let mainView: HTMLElement;
    let messages: { username: string; message: string }[] = $state([]);
    let chatContainer: HTMLElement;
    let messageNav: HTMLElement;
    let messageInput: string = $state('');
    let messageTextInput: HTMLInputElement;
    let socket: WebSocket;
    let goDownButton: Boolean = $state(false);

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

    function chatBoxResize() {
        let height = window.innerHeight - parseFloat(window.getComputedStyle(messageNav).height) - 50;
        chatContainer.style.height = height + "px";
    }


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
        messageInput = ""
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
        console.log("Scrolled to bottom");
        goDownButton = false

    }

    $effect.pre(() => {
        messages;
        const autoscroll = chatContainer && chatContainer.offsetHeight + chatContainer.scrollTop > chatContainer.scrollHeight - 50;

        if (autoscroll) {
            tick().then(() => {
                chatContainer.scrollTo(0, chatContainer.scrollHeight);
            });
        }
    })

    onMount(() => {
        openSocket();
        setTimeout(()=>{
            scrollToBottom();
        },100)
        loadMessages()
            .then((loadedMessages) => {
                messages = loadedMessages; // Set messages to display
            })
            .catch((error) => {
                console.error("Error loading messages:", error);
            });
        window.onresize = function () {
            chatBoxResize();
        }
        chatContainer.onload = scrollToBottom;
        chatContainer.onscroll = () => {
            if (chatContainer.scrollTop + chatContainer.offsetHeight < (chatContainer.scrollHeight - chatContainer.offsetHeight)) {
                goDownButton = true;
            } else {
                goDownButton = false;

            }
        }
    });

</script>

<main class="responsive fixed center middle" bind:this={mainView}>
    <div id="chatbox" class="bottom-padding" bind:this={chatContainer}>
        <button class="scrollToBottom top fixed right round chip small-elevate tertiary-container {goDownButton ? 'active':''}"
                onclick="{scrollToBottom}">
            <span class="right-margin">Jump to newest messages</span>
            <i>arrow_downward</i>
        </button>
        {#if messages.length === 0}
            <h3 class="center-align middle">No messages yet...</h3>
        {:else}
            <p id="top-line-text" class="center-align">You've reached the start of the chat</p>
            <p id="top-line">
                -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</p>
            {#each messages as {username, message}}
                {#if username === getCookie('username')}
                    <article class="message bottom-round left-round border self" in:slide|global out:blur|global>
                        <div class="column" style="border-radius: 0">
                            <div class="row self">
                                <h5 class="right-align">You</h5>

                                <img class="circle right right-align  large"
                                     alt="{username}'s profile picture"
                                     src="{dev ? 'http://localhost:8080' : ''}/icons/{username}.png"
                                >
                            </div>

                            <p class="message-text">{message}</p>
                        </div>
                    </article>
                {:else}
                    <article class="message bottom-round right-round secondary-container"
                             in:slide|global={{ axis: 'x' }}  out:blur|global >
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
            <input type="text" bind:value={messageInput} bind:this={messageTextInput}
                   onkeydown={(event)=>{event.key === 'Enter' ? sendMessage() : ''}}/>
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
        display: flex;
        overflow-y: scroll;
        flex-direction: column;
        width: 80%;
    }

    .self {
        margin-left: auto;
        margin-right: 5px;

        h5, img {
            display: inline;
        }

        h5 {
            margin-left: inherit;
        }


    }

    #chatbox {
        flex-grow: 1;
        overflow-y: scroll;
        overflow-x: hidden;
        height: 90vh;
    }

    @media only screen and (max-width: 600px) {
        #message-nav {
            margin-top: 1em;
            margin-bottom: 15vh;
        }

        main {
            width: 100%;
            margin: 0;
            padding: 10px
        }
        .scrollToBottom{
            margin-top: 5vh !important;
            font-size: 1.0em !important;
        }

    }

    #message-nav {
        overflow: visible;
        flex-grow: 1;
    }

    .message, h3 {
        word-break: break-all;
    }

    #top-line {
        white-space: nowrap;
        color: var(--surface);
        text-decoration: var(--on-surface) underline wavy;
        text-decoration-thickness: 3px;
        padding-bottom: 3px;
        overflow-x: hidden;
    }

    .scrollToBottom {
        transform: scale(0) rotate(0deg);
        display: inline;
        transition: transform 1s;
        transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 100;
        font-size: 1.3em;
        margin: 2em;
    }

    .scrollToBottom.active {
        transform: scale(1) rotate(720deg);
    }

    #top-line-text {
        color: var(--on-surface);
        font-size: 1.7rem;
    }

</style>