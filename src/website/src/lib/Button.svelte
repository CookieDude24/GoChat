<script>
  export let state = false;

  const toggle = () => {
    state = true;
  };
</script>

<button onclick={toggle}>
  State is {state ? 'active' : 'inactive'}
</button>
