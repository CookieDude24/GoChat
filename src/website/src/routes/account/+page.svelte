<script type="ts">
    import {getCookie, User} from '../Global.svelte.ts';
    import { fly } from 'svelte/transition'
    import {goto} from "$app/navigation";
    import {dev} from '$app/environment';
    import {onMount} from "svelte";
    import LoginAndSignUpButtons from "$lib/LoginAndSignUpButtons.svelte";

    let baseurl = dev ? "http://localhost:8080" : ""

    let user = new User();
    let copied = $state(false);
    let authenticated = $state(new User().validateLogin())


    onMount(() => {
        if (!authenticated) {
            goto("/signup");
        }
    })

    function copyApiKeytoClipboard() {
        copied = true
        setTimeout(function () {
            copied = false
        }, 2000)
        navigator.clipboard.writeText(getCookie("user_id"));
    }

    function signout() {
        user.signout()
        goto("/");
    }
</script>

{#await authenticated}
    <progress class="top fixed" transition:fly ></progress>
    <main class="responsive fixed center middle center-align" transition:fly>
        <h1>Loading Account page...</h1>
    </main>


{:then authenticated}
    {#if authenticated}
        <main class="responsive fixed center middle" transition:fly>

            <div class="center-align">
                <h5>Hi {user.username}!</h5>
                <img src="{baseurl}/icons/{user.username}.png" class="circle extra margin">
                <div>Access your API-Key or delete your Account here!</div>
            </div>
            <nav class="center-align l">
                <button class="round tertiary-container extra" onclick="{signout}">
                    <i>logout</i>
                    <span>Log out of your account</span>
                </button>
                <button class="round extra fill" onclick="{copyApiKeytoClipboard}">
                    <i>content_paste</i>
                    <span>Copy API-Key to Clipboard</span>
                </button>
            </nav>

            <nav class="center-align s m vertical">
                <button class="round tertiary-container responsive" onclick="{signout}">
                    <i>logout</i>
                    <span>Log out of your account</span>
                </button>
                <button class="round fill responsive" onclick="{copyApiKeytoClipboard}">
                    <i>content_paste</i>
                    <span>Copy API-Key to Clipboard</span>
                </button>
            </nav>
        </main>

    {:else }
        <main class="responsive fixed center middle center-align" transition:fly>
            <h1>You're not signed in!</h1>
            <p>Login or Signup now!</p>

            <LoginAndSignUpButtons/>
        </main>
    {/if}
{:catch error}
    <h1 transition:fly>Error when trying to check auth status!</h1 >
    <h5>Error:</h5>
    <p>e</p>
{/await}


<div class="snackbar primary absolute center bottom {copied ? 'active' : ''}" id="api-key-copied"><i>content_paste</i>
    API-Key successfully
    copied to clipboard!
</div>

<style>
    main {
        margin: auto;
        width: 100vw !important;
    }

    button {
        box-sizing: border-box;

        max-width: 400px !important;
    }
</style>