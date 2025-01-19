<script lang="ts">
    import {getCookie} from "../routes/Global.svelte";
    let copied: boolean = $state(false);
    function copyLinktoClipboard() {
        copied = true
        setTimeout(function () {
            copied = false
        }, 2000)
        navigator.clipboard.writeText(getCookie("user_id"));
    }
</script>
<nav class="m l left" style="overflow-x: hidden;">
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
<div class="snackbar primary absolute center bottom {copied ? 'active' : ''}" id="share_button_snackbar"><i>content_paste</i> Copied link to
    clipboard!
</div>