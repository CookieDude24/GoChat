<script>
    import LoginAndSignUpButtons from "$lib/LoginAndSignUpButtons.svelte";
    import {fly, blur} from 'svelte/transition'
    import {goto, invalidateAll} from "$app/navigation";
    import {onMount} from "svelte";
    import {User} from "../Global.svelte.ts";
    let {children} = $props();

    let authenticated = $state(new User().validateLogin())

    onMount(() => {
        if (!authenticated) {
            goto("/signup");
        }
    })
</script>

{#await authenticated}
    <progress class="top fixed" transition:fly></progress>
    <main class="responsive fixed center middle center-align" transition:fly>
        <h1>Loading Account page...</h1>
    </main>
{:then authenticated}
    {#if authenticated}
        <main class="responsive fixed center {window.matchMedia('screen and (max-width: 600px)').matches ? 'top' : 'middle'}"
              transition:blur>
        {@render children()}
        </main>
    {:else }
        <main class="responsive fixed center middle center-align" transition:blur>
            <h1>You're not signed in!</h1>
            <p>Login or Signup now!</p>

            <LoginAndSignUpButtons/>
        </main>
    {/if}
{:catch error}
    <h1 transition:fly>Error when trying to check auth status!</h1>
    <h5>Error:</h5>
    <p>e</p>
{/await}

<style>
    h1 {
        word-break: break-word;
    }

    main {
        margin: auto;
        width: 80vw;
        height: max(80vh, fit-content);
    }



    @media (max-width: 600px) {
        main {
            height: 85vh;
            width: 100vw;
            overflow-y: scroll;
        }
    }

</style>