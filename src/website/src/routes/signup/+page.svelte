<script lang="ts">
    import {goto} from "$app/navigation";
    import {User} from '../Global.svelte.ts';
    import ProgressDialog from "$lib/ProgressDialog.svelte";
    import {fly} from "svelte/transition"
    import {onMount} from "svelte";

    let loading = $state(false);

    let user = new User();
    let error = $state(false);
    let usernameInput:HTMLInputElement;

    onMount(() => {
        usernameInput.focus();
    })

    async function signup() {
        loading = true;
        let success = await user.signup()
        console.log("signing up: ",success)
        if (success) {
            goto("/account");
        }else {
            error = true;
            setTimeout(()=>{error = false}, 5000);
        }
    }
</script>
{#if !loading}
<main class="responsive fixed center middle" style="padding: 0" transition:fly>
    <h5>Enter Username</h5>
    <div>You need a username to chat!</div>
    <div class="field label large fill round">
        <input type="text" bind:this={usernameInput} bind:value={user.username} onkeydown="{(event)=>{event.key === 'Enter' ? signup(): ''}}" maxlength="20" />
        <label>Username</label>
    </div>
    <nav class="center-align l">
        <button class="round extra fill" onclick={()=>goto("/login")}>
            <i>login</i>
            <span>Login</span>
        </button>
        <button class="round extra primary" onclick={()=>signup()}>
            <i>add_circle</i>
            <span>Create User</span>
        </button>
    </nav>
    <nav class="center-align s m vertical">
        <button class="round extra fill responsive" onclick={()=>goto("/login")}>
            <i>login</i>
            <span>Login</span>
        </button>
        <button class="round extra primary responsive" onclick={()=>signup()}>
            <i>add_circle</i>
            <span>Create User</span>
        </button>
    </nav>
</main>
{:else }
    <ProgressDialog bind:state={loading} />
{/if}
<div class="snackbar error absolute center bottom {error ? 'active' : ''}" >Username already taken!</div>
