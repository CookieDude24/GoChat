<script>
    import {
        blur,
        crossfade,
        draw,
        fade,
        fly,
        scale,
        slide
    } from 'svelte/transition';

    export let state = true

</script>

<dialog class="max active" id="about-dialog"  transition:fade>
    <main class="responsive absolute center middle">
        <h5>About GoChat</h5>
        <p>
            GoChat was made by Maximilian Dorninger as a Hack Club High Seas project.
            It's a real-time chat app which uses technologies like websockets and GoLang.

        </p>
        <h6>
            Attributions
        </h6>
        <p>The Gopher-Icon was created by Takuya Ueda (https://twitter.com/tenntenn). Licensed under the Creative
            Commons 3.0 Attributions license.</p>
        <button class="round extra fill" on:click={() => state = false}>
            <i>close</i>
            <span>Return</span>
        </button>
    </main>
</dialog>