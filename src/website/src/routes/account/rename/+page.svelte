<script lang="ts">
    import AccountGreeting from "$lib/AccountGreeting.svelte";
    import {User, baseurl} from '../../Global.svelte.ts';
    import {goto} from "$app/navigation";
    import Snackbar from "$lib/Snackbar.svelte";

    let newUsername: string = $state("");
    let error = $state(false);

    function renameAccount() {
        const user = new User();
        let username = user.username;
        let apikey = user.apikey;
        fetch(baseurl + "/users", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify({"username": username, "user_id": apikey, "message": newUsername}),
        }).then(async response => {
            if (response.status === 204) {
                goto("/account");
                user.setUsername(newUsername);
            } else {
                console.log(`HTTP error! status: ${response.status}`);
                error = true
            }
        })
    }

</script>
<AccountGreeting text="Change your username here, but beware max. 20 characters"></AccountGreeting>
<Snackbar text="Username already taken!" error={true} active={true}/>
<nav class="center-align l">
    <div class="field label round fill  extra">
        <input type="text" name="message" bind:value={newUsername} maxLength="20"/>
        <label>new Username</label>
    </div>
    <button class="round primary-container extra" onclick="{renameAccount}">
        <i>check</i>
        <span>Confirm</span>
    </button>
</nav>

<nav class="center-align s m vertical">
    <div class="field label round  fill extra">
        <input type="text" name="message" bind:value={newUsername} maxLength="20"/>
        <label>new Username</label>
    </div>
    <button class="round primary-container extra" onclick="{renameAccount}">
        <i>check</i>
        <span>Confirm</span>
    </button>
</nav>

<Snackbar text="Username already taken!" error={true} bind:active={error}/>
