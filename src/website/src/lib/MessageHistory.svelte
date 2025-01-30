<script lang="ts">
    import {slide, blur} from "svelte/transition"
    import {baseurl, username} from "../routes/Global.svelte"
    import {dev} from "$app/environment"

    let {currentChatroom} = $props()
    let socket: WebSocket;
    let messages: { username: string; message: string, chat_room: string }[] = $state([]);


    $effect(()=>{
        loadMessages()
            .then((loadedMessages) => {
                messages = loadedMessages;
                console.log(loadedMessages);
            })
            .catch((error) => {
                console.error("Error loading messages:", error);
            });
    })

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
        console.log("Scrolled to bottom");
        goDownButton = false

    }

    function loadMessages() {
        let url = baseurl + "/messages";

        return fetch(url, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .catch((error) => {
                console.error("Failed to load messages:", error);
                throw error;
            });
    }
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
            console.log("Received message: ", message);
            messages = [...messages, message]; // Append new message

            // for firefox compatibility
            setTimeout(() => {
                scrollToBottom()
            }, 500)
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

</script>

{#if messages.length === 0}
    <h3 class="center-align middle">No messages yet...</h3>
{:else}
    <p id="top-line-text" class="center-align">You've reached the start of the chat</p>
    <p id="top-line">
        -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</p>
    {#each messages as {user, message, chat_room}}
        {#if chat_room === currentChatroom}
            {#if user === username}
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
                         in:slide|global={{ axis: 'x' }} out:blur|global>
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
        {/if}
    {/each}
{/if}