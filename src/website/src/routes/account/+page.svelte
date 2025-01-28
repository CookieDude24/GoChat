<script lang="ts">
    import {getCookie, User, baseurl} from '../Global.svelte.ts';
    import {goto, invalidateAll} from "$app/navigation";
    import AccountGreeting from "$lib/AccountGreeting.svelte";

    let user = new User();
    let copied = $state(false);
    let iconInput: HTMLInputElement;
    let uploadProfilePictureDialog = $state(false);
    let error = $state(false);

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


    async function uploadProfilePicture() {
        let formData = new FormData();

        formData.append("username", user.username);
        formData.append("user_id", user.apikey);
        formData.append("photo", iconInput.files[0]);
        try {
            const response = await fetch(baseurl + "/uploadicon", {
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
        setTimeout(() => {
            error = false
        }, 5000)
    }

    function deleteAccount() {
        const user = new User();
        let username = user.username
        let apikey = user.apikey;
        fetch(baseurl + "/account", {
            method: "DELETE", // HTTP method
            headers: {
                "Content-Type": "application/json", // Indicates JSON payload
            }, body: JSON.stringify({"username": username, "user_id": apikey}), // Send the string in the request body
        }).then(async response => {
            if (response.status === 204) {
                signout()
            } else {
                console.log(`HTTP error! status: ${response.status}`);
            }
        })
        console.log("deleted Account");
    }
</script>


<AccountGreeting text="Access your API-Key, change your profile picture or logout here!"></AccountGreeting>

<dialog class="{uploadProfilePictureDialog ? 'active' : 'inactive'} center-align max">
    <h3 class="margin">Upload your profile picture</h3>
    <p class="margin">Click on the button below to upload your own custom profile picture</p>
    <p class="margin bold deep-orange-text">Updating the profile picture may take a few minutes (waiting for browser
        cache invalidation)!</p>

    <button class="tertiary-container extra margin">
        <i>attach_file</i>
        <span>File</span>
        <input type="file" id="photo" accept="image" bind:this={iconInput}>
    </button>
    <nav class="center-align">
        <button class="extra fill" onclick="{toggleDialog}">Cancel</button>
        <button type="submit" class="extra " onclick="{uploadProfilePicture}">Confirm</button>
    </nav>
</dialog>

<nav class="center-align l">
    <div class="column">
        <div class="row center-align">
            <button class="round tertiary-container extra" onclick="{signout}">
                <i>logout</i>
                <span>Log out of your account</span>
            </button>
            <button class="round tertiary-container extra" onclick="{deleteAccount}">
                <i>delete</i>
                <span>Delete your account</span>
            </button>
        </div>
        <div class="row center-align">
            <button class="round secondary-container extra" onclick="{toggleDialog}">
                <i>upload</i>
                <span>Upload New Profile Picture</span>
            </button>
            <button class="round secondary-container extra" onclick="{()=>{goto('/account/rename')}}">
                <i>edit</i>
                <span>Edit your username</span>
            </button>
            <button class="round extra secondary-container" onclick="{copyApiKeytoClipboard}">
                <i>content_paste</i>
                <span>Copy API-Key to Clipboard</span>
            </button>
        </div>
    </div>
</nav>

<nav class="center-align s m vertical">
    <button class="round tertiary-container responsive" onclick="{deleteAccount}">
        <i>delete</i>
        <span>Delete your account</span>
    </button>
    <button class="round tertiary-container responsive" onclick="{signout}">
        <i>logout</i>
        <span>Log out of your account</span>
    </button>
    <button class="round fill responsive" onclick="{copyApiKeytoClipboard}">
        <i>content_paste</i>
        <span>Copy API-Key to Clipboard</span>
    </button>
    <button class="round secondary-container responsive" onclick="{()=>{goto('/account/rename')}}">
        <i>edit</i>
        <span>Edit your username</span>
    </button>
    <button class="round secondary-container responsive" onclick="{toggleDialog}">
        <i>upload</i>
        <span>Upload Profile Picture</span>
    </button>
</nav>


<div class="snackbar primary absolute center bottom {copied ? 'active' : ''}" id="api-key-copied"><i>content_paste</i>
    API-Key successfully
    copied to clipboard!
</div>
<div class="snackbar error absolute center bottom {error ? 'active' : ''}">Error uploading profile picture!</div>
