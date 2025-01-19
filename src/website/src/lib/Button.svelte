<script>
  //export let state = false;
  let { state = $bindable() } = $props()

  const toggle = () => {
    state = true;
  };
</script>

<button onclick={toggle}>
  State is {state ? 'active' : 'inactive'}
</button>
