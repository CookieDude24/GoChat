<script>
    import Button from '../lib/Button.svelte';
    import ProgressDialog from "../lib/ProgressDialog.svelte";
    import MainNavBar from "../lib/MainNavBar.svelte";
    import AboutDialog from "../lib/AboutDialog.svelte";
    let progressDialog = false;
    let aboutDialog = false;
</script>

<main>
    <MainNavBar bind:aboutDialog />
    <Button bind:state={progressDialog} />

    {#if progressDialog}
        <ProgressDialog/>
    {/if}



</main>