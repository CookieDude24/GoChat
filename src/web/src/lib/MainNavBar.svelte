<script>
    import AboutDialog from "./AboutDialog.svelte";


    let aboutDialog = false;

    function openAboutDialog() {
        aboutDialog = true
    }
</script>


<nav class="m l left" style="overflow-x: hidden;">
    <a onclick={openAboutDialog}
       href="#"
       class="account">
        <i>account_circle</i>
        <div>Your Account</div>
    </a>
    <a href="#">
        <i>share</i>
        <div>Share</div>
    </a>
    <div class="max">

    </div>
    <a href="#"
       onclick={openAboutDialog}>
        <i>info</i>
        <div>About</div>
    </a>
</nav>

<nav class="s bottom">
    <a class="account">
        <i>account_circle</i>
    </a>

    <a>
        <i>share</i>
        <div>Share</div>
    </a>

    <a>
        <i>info</i>
        <div>About</div>
    </a>

</nav>
{#if aboutDialog}
    <AboutDialog bind:state={aboutDialog}/>
{/if}