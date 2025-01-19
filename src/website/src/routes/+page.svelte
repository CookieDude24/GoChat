<script lang="ts">
    import {onMount} from "svelte";
    import {dev} from "$app/environment";
    import {getCookie} from "./Global.svelte";

    let messages: { username: string; message: string }[] = [];

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

    function openSocket() {
        let socket;
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
</script>

<main class="responsive fixed center middle">
    {#if messages.length === 0}
        <p>No messages yet...</p>
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
</main>
<style>
    main {
        height: 100vh;
        overflow-y: scroll;
        width: 80%;
    }
    .self {
        margin-left: auto;
        margin-right: 0;

    }

</style>