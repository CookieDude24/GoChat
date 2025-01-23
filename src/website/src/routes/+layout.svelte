<script lang="ts">
    import { fly } from 'svelte/transition'
    import MainNavBar from "$lib/MainNavBar.svelte";

    export let data
</script>
<MainNavBar/>

{#key data.url}
    <div    class ="l m"
            in:fly={{ y: -200, duration: 300, delay: 200 }}
            out:fly={{ y: 200, duration: 300 }}
    >
        <slot />
    </div>

    <div    class ="s"
            in:fly={{ x: -200, duration: 300, delay: 200 }}
            out:fly={{ x: 200, duration: 300 }}
    >
        <slot />
    </div>
{/key}
<style >
    :root{
        font-size: 1.2em;

    }
</style>