<script lang="ts">
    import {getCookie, User} from '../Global.svelte.ts';
    import {fly, blur} from 'svelte/transition'
    import {goto, invalidateAll} from "$app/navigation";
    import {dev} from '$app/environment';
    import {onMount} from "svelte";
    import LoginAndSignUpButtons from "$lib/LoginAndSignUpButtons.svelte";

    let baseurl = dev ? "http://localhost:8080" : ""

    let user = new User();
    let copied = $state(false);
    let authenticated = $state(new User().validateLogin())

    let uploadProfilePictureDialog = $state(false);
    let error =$state(false);

    onMount(() => {
        if (!authenticated) {
            goto("/signup");
        }
    })

    function copyApiKeytoClipboard() {
        copied = true
        setTimeout(function () {
            copied = false
        }, 2000)
        navigator.clipboard.writeText(getCookie("user_id"));
    }

    function signout() {
        user.signout()
        goto("/");
    }

    function toggleDialog() {
        uploadProfilePictureDialog = !uploadProfilePictureDialog;
    }
    let iconInput: HTMLInputElement;

    async function uploadProfilePicture() {
        let formData = new FormData();

        formData.append("username", user.username);
        formData.append("user_id", user.apikey);
        formData.append("photo", iconInput.files[0]);
        try {
            const response = await fetch(baseurl+"/uploadicon", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                console.log("Image uploaded successfully!");
                invalidateAll()
                uploadProfilePictureDialog = false;
                location.reload();
            } else {
                console.error("Failed to upload image. Status:", response.status);
                error = true
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            error = true
        }
        setTimeout(()=>{
            error = false
        },5000)
    }
</script>

{#await authenticated}
    <progress class="top fixed" transition:fly></progress>
    <main class="responsive fixed center middle center-align" transition:fly>
        <h1>Loading Account page...</h1>
    </main>


{:then authenticated}
    {#if authenticated}

        <main class="responsive fixed center middle" transition:blur>

            <div class="center-align">
                <h1>Hi {user.username}!</h1>
                <img alt="your profile icon" src="{baseurl}/icons/{user.username}.png" class="circle extra margin"
                     id="user-icon">
                <div>Access your API-Key, change your profile picture or logout here!</div>
            </div>

            <dialog class="{uploadProfilePictureDialog ? 'active' : 'inactive'} center-align max">
                <h3 class="margin">Upload your profile picture</h3>
                <p class="margin">Click on the button below to upload your own custom profile picture. (Only .png files allowed!)</p>
                <button class="tertiary-container extra margin">
                    <i>attach_file</i>
                    <span>File</span>
                    <input type="file" id="photo" accept="image/png" bind:this={iconInput}>
                </button>
                <nav class="center-align">
                    <button class="extra fill" onclick="{toggleDialog}">Cancel</button>
                    <button type="submit" class="extra " onclick="{uploadProfilePicture}">Confirm</button>
                </nav>
            </dialog>


            <nav class="center-align l">
                <button class="round tertiary-container extra" onclick="{signout}">
                    <i>logout</i>
                    <span>Log out of your account</span>
                </button>
                <button class="round secondary-container extra" onclick="{toggleDialog}">
                    <i>upload</i>
                    <span>Upload New Profile Picture</span>
                </button>
                <button class="round extra secondary-container" onclick="{copyApiKeytoClipboard}">
                    <i>content_paste</i>
                    <span>Copy API-Key to Clipboard</span>
                </button>
            </nav>

            <nav class="center-align s m vertical no-margin">
                <button class="round tertiary-container responsive" onclick="{signout}">
                    <i>logout</i>
                    <span>Log out of your account</span>
                </button>
                <button class="round fill responsive" onclick="{copyApiKeytoClipboard}">
                    <i>content_paste</i>
                    <span>Copy API-Key to Clipboard</span>
                </button>
                <button class="round secondary-container responsive" onclick="{toggleDialog}">
                    <i>upload</i>
                    <span>Upload Profile Picture</span>
                </button>
            </nav>
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


<div class="snackbar primary absolute center bottom {copied ? 'active' : ''}" id="api-key-copied"><i>content_paste</i>
    API-Key successfully
    copied to clipboard!
</div>
<div class="snackbar error absolute center bottom {error ? 'active' : ''}">Error uploading profile picture!</div>


<style>
    main {
        margin: auto;
        width: 100vw !important;
    }
    @media (max-width: 600px) {
        main {
            overflow-y: scroll;
        }
    }
    button {
        box-sizing: border-box;

        max-width: 400px !important;
    }

    #user-icon {
        width: 10em;
        height: 10em;
    }

    h1 {
        word-break: break-all;
    }
</style>