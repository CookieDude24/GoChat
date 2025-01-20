<script>
import {goto} from "$app/navigation";
function signUp() {
    goto("/signup");
}
function login() {
    goto("/login");
}
</script>

<nav class="center-align l m">
    <button class="round tertiary-container extra" onclick="{login}">
        <i>login</i>
        <span>Login</span>
    </button>
    <button class="round extra fill" onclick="{signUp}">
        <i>add_circle</i>
        <span>Sign Up</span>
    </button>
</nav>

<nav class="s vertical">
    <button class="round tertiary-container responsive" onclick="{login}">
        <i>login</i>
        <span>Login</span>
    </button>
    <button class="round fill responsive" onclick="{signUp}">
        <i>add_circle</i>
        <span>Sign Up</span>
    </button>
</nav>