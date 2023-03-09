<script lang="ts">
	import { fade } from 'svelte/transition';
	import '../styles/style.css';
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="app" transition:fade>
	<slot />
</div>