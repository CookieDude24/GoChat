<script>
    import {onMount} from "svelte";
    import {fly} from "svelte/transition"

    let {state = $bindable()} = $props()

    onMount(() => {
        setTimeout(() => {
            state = false
        }, 1500)
    })
</script>


<main class="responsive fixed center middle" transition:fly >
    <h5 id="progress-dialog-text">Loading ...</h5>
    <progress style="margin-top: 5em"></progress>
</main>