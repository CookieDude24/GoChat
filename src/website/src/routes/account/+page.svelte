<script type="ts">
    import {getCookie, User} from '../Global.svelte.ts';
    import {goto} from "$app/navigation";
    import { dev } from '$app/environment';
    import {onMount} from "svelte";

    let baseurl=""
    if(dev){
        baseurl = "http://localhost:8080";
    }

    let user = new User();
    let copied = $state(false);
    let authenticated = null;

    onMount(async () => {
        user = new User();
        authenticated = await user.validateLogin();
        if(!authenticated){
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
    function signout(){
        user.signout()
        goto("/");
    }
</script>
<main class="responsive fixed center middle">
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
            <button class="round extra fill">
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

<div class="snackbar primary absolute center bottom {copied ? 'active' : ''}" id="api-key-copied"><i>content_paste</i> API-Key successfully
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