<script lang="ts">
    import {fly} from 'svelte/transition'

    let {active = $bindable(false), text = "An Error Occurred", error = false} = $props()


    $effect(() => {
        if (active) {
            setTimeout(() => {
                active = false
            }, 3000)
        }
    })

    function close() {
        active = false;
    }
</script>

<div class="snackbar absolute center bottom {active ? 'active' : ''}{error ? 'error':''}" transition:fly>
    <div class="max">{text}</div>
    <a onclick="{close}">
        <i>close</i>
    </a>
</div>

