<script lang="ts">
    import {User, baseurl} from '../routes/Global.svelte.ts';
    let user: User = $state(new User())
    let { text } = $props()
</script>

<div class="center-align">
    <h1>Hi {user.username}!</h1>
    <img alt="your profile icon" src="{baseurl}/icons/{user.username}.png" class="circle extra margin m l"
         id="user-icon" style='width: 10em;height: 10em;'>
    <img alt="your profile icon" src="{baseurl}/icons/{user.username}.png" class="circle extra margin s"
         id="user-icon" style='width: 10vh;height: 10vh;'>
    <div>{text}</div>
</div>
<style>
    h1{
        word-break: break-word;
    }
</style>