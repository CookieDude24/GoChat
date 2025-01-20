<script lang="ts">
    import {getCookie, User} from "../routes/Global.svelte";
    import {dev} from "$app/environment";
    import {onNavigate} from "$app/navigation";
    import {onMount} from "svelte";

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
        navigator.clipboard.writeText(getCookie("user_id"));
    }
    onMount(async ()=>{
        auth = await new User().validateLogin()
        user = new User()
    })
    let auth = $state(false);
    let user: User = $state(new User());
    onNavigate(async ()=>{
        let auth2 = new User().validateLogin();
        let user2 = new User();

        if (auth2 != auth || user2.username != user.username) {
            auth = await new User().validateLogin();
            user = new User();
        }
    })

</script>
<nav class="m l left" style="overflow-x: hidden;">
    <a href="/account"
       class="account">
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
    <a href="/">
        <i>chat</i>
        <div>Chat</div>
    </a>
    <a href="#" onclick={copyLinktoClipboard}>
        <i>share</i>
        <div>Share</div>
    </a>
    <div class="max">

    </div>
    <a href="/about">
        <i>info</i>
        <div>About</div>
    </a>
</nav>

<nav class="s bottom">
    <a href="/account"
       class="account">
        <i>account_circle</i>
        <div>Your Account</div>
    </a>
    <a href="/">
        <i>chat</i>
        <div>Chat</div>
    </a>
    <a href="#" onclick={copyLinktoClipboard}>
        <i>share</i>
        <div>Share</div>
    </a>

    <a href="/about">
        <i>info</i>
        <div>About</div>
    </a>

</nav>
<div class="snackbar primary absolute center bottom {copied ? 'active' : ''}" id="share_button_snackbar"><i>content_paste</i>
    Copied link to
    clipboard!
</div>