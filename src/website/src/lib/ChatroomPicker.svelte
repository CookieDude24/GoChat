<script>
    import {baseurl} from "../routes/Global.svelte.ts";

    let {active = $bindable(), selectedChatroom = $bindable()} = $props()
    let promise = $state()
    let newChatroom = $state("")
    $effect(() => {
        if (active)
            promise = loadChatrooms()
    })

    function loadChatrooms() {
        let url = baseurl + "/chatrooms";

        return (fetch(url, {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .catch((error) => {
                console.error("Failed to load chatrooms:", error);
                throw error;
            }));
    }
    function createChatroom(){
        console.log("creating chatroom: ", newChatroom);
        selectedChatroom = newChatroom;
        active = false
    }

</script>


<dialog class="max {active ? 'active' : 'inactive'} center-align">
    <div style="width: min(80vh,80vw)" class="center middle">
        <h5>Choose or create a new Chatroom</h5>
        {#await promise}
            <h3>Loading ... </h3>
        {:then chatrooms}
            <article class="center-align center">
                {#each chatrooms as chatroom}
                    <a class="row padding wave surface-container"
                       onclick="{()=>{selectedChatroom = chatroom; active=false}}">
                        <i>forum</i>
                        <div class="max">
                            <h6 class="small">{chatroom}</h6>
                        </div>
                    </a>
                {/each}
                    <div class="field label prefix fill round large">
                        <i>create</i>
                        <input type="text" bind:value={newChatroom} onkeydown="{(event)=>{event.key === 'Enter' ? createChatroom(): ''}}" maxlength="10">
                        <label>Create Chatroom</label>
                    </div>

            </article>
        {:catch error}
            <h3>Error loading chatrooms</h3>
            <p>{error}</p>
        {/await}

        <nav class="right-align">
            <button class="border" onclick="{()=>{active=false}}">Cancel</button>
            <button class="primary" onclick="{createChatroom}">Confirm</button>
        </nav>
    </div>
</dialog>