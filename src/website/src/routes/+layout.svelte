<script lang="ts">
    import { blur, fade } from 'svelte/transition'
    import MainNavBar from "$lib/MainNavBar.svelte";

    export let data
</script>
<MainNavBar/>

{#key data.url}
    <div    class ="l m"
            in:blur={{ y: -200, duration: 300, delay: 100 }}
            out:blur={{ y: 200, duration: 100 }}
    >
        <slot />
    </div>

    <div    class ="s"
            in:blur={{ x: -200, duration: 300, delay: 100 }}
            out:blur={{ x: 200, duration: 100 }}
    >
        <slot />
    </div>
{/key}
<style >
    :root{
        font-size: 1.2em;
    }

</style>