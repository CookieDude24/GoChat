<script lang="ts">
    import {getCookie, User} from "../routes/Global.svelte";
    import {dev} from "$app/environment";
    import {afterNavigate, onNavigate} from "$app/navigation";
    import {onMount} from "svelte";
    import {page} from '$app/state';

    let baseurl: string = "";
    if (dev) {
        baseurl = "http://localhost:8080";
    }

    let copied: boolean = $state(false);

    function copyLinktoClipboard() {
        copied = true
        setTimeout(function () {
            copied = false
        }, 2000)
        navigator.clipboard.writeText("https://chat.maxid.me/");
    }

    onMount(async () => {
        auth = await new User().validateLogin()
        user = new User()
    })
    let auth = $state(false);
    let user: User = $state(new User());
    onNavigate(async () => {
        let auth2 = new User().validateLogin();
        let user2 = new User();

        if (auth2 != auth || user2.username != user.username) {
            auth = await new User().validateLogin();
            user = new User();
        }
    })
    afterNavigate(() => {


    })
</script>

<nav class="m l left right-padding" style="overflow-x: hidden;">
    <a href="/account"
       class="account padding {page.url.pathname === '/account' ? 'active' : ''}">
        {#await auth}
            <i>account_circle</i>
        {:then authenticated}
            {#if authenticated}
                <img src="{baseurl}/icons/{user.username}.png"
                     class="circle"
                     alt="your profile picture">
            {:else }
                <i>account_circle</i>
            {/if}
        {/await}
        <div>Your Account</div>
    </a>
    <a href="/"
       class="{page.url.pathname === '/' ? 'active' : ''}">
        <i>chat</i>
        <div>Chat</div>
    </a>
    <a href="/" onclick={copyLinktoClipboard}>

        <i>share</i>
        <div>Share</div>
    </a>
    <div class="max">

    </div>
    <a href="/about"
       class="{page.url.pathname === '/about' ? 'active' : ''}">

        <i>info</i>
        <div>About</div>
    </a>
</nav>

<nav class="s bottom">
    {#await auth}
        <a href="/account"
           class="{page.url.pathname === '/account' ? 'active' : ''}">
            <i>account_circle</i>
            <div>Login</div>
        </a>

    {:then authenticated}
        {#if authenticated}
            <a href="/account"
               class="bottom-margin {page.url.pathname === '/account' ? 'active' : ''}">
                <img src="{baseurl}/icons/{user.username}.png"
                     class="circle top-margin"
                     alt="your profile picture">
            </a>

        {:else }
            <a href="/account"
               class="{page.url.pathname === '/account' ? 'active' : ''}">
                <i>account_circle</i>
                <div>Login</div>
            </a>
        {/if}
    {/await}
    <a href="/" class="{page.url.pathname === '/' ? 'active' : ''}">

        <i>chat</i>
        <div>Chat</div>
    </a>
    <a onclick={copyLinktoClipboard}>

        <i>share</i>
        <div>Share</div>
    </a>

    <a href="/about" class="{page.url.pathname === '/about' ? 'active' : ''}">

        <i>info</i>
        <div>About</div>
    </a>

</nav>
<div class="snackbar primary absolute center bottom {copied ? 'active' : ''}" id="share_button_snackbar"><i>content_paste</i>
    Copied link to
    clipboard!
</div>
<style>
    .account.active div, .account:hover div {
        background: var(--secondary-container);
        border-radius: 15px;
        padding: 5px;
    }
    .account div {
        padding: 5px;
    }
    *{
        overflow-x: hidden;
    }



</style>