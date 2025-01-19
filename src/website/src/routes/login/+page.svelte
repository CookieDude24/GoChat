<script>
    import {goto} from "$app/navigation";
    import {User} from '../Global.svelte.ts';
    import ProgressDialog from "$lib/ProgressDialog.svelte";
    import {fly} from "svelte/transition"

    let loading = $state(false);

    let user = new (User);
    let error = $state(false);
    async function login() {
        loading = true;
        let success = await user.validateLogin()
        if (success) {
            goto("/account");
        } else {
            error = true;
            setTimeout(() => {
                error = false
            }, 5000);
        }
    }
</script>
{#if !loading}
    <main class="responsive fixed center middle" transition:fly={{ delay: 100 }}>


        <h5>Login</h5>
        <div class="field label large fill round">
            <input type="text" bind:value={user.username}/>
            <label>Username</label>
        </div>
        <div class="field label large fill round">
            <input type="password" bind:value={user.apikey}/>
            <label>API-Key</label>
        </div>
        <nav class="center-align responsive m l">
            <button class="round fill extra" onclick={()=>goto("/signup")}>
                <i>add_circle</i>
                <span>Create Account</span>
            </button>
            <button class="round extra primary" onclick={()=>login()}>
                <i>login</i>
                <span>Login</span>
            </button>
        </nav>
        <nav class="center-align responsive s vertical">
            <button class="round fill extra responsive" onclick={()=>goto("/signup")}>
                <i>add_circle</i>
                <span>Create Account</span>
            </button>
            <button class="round extra primary responsive" onclick={()=>login()}>
                <i>login</i>
                <span>Login</span>
            </button>
        </nav>
    </main>
{:else }
    <ProgressDialog bind:state={loading}/>
{/if}
<div class="snackbar error absolute center bottom {error ? 'active' : ''}">Username or API-Key wrong!</div>



