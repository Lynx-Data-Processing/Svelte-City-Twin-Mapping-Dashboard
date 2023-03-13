<script>
	import { fade } from 'svelte/transition';
	import '../../styles/style.css';
	import Footer from '../../widgets/Footer.svelte';
	import Navbar from '../../widgets/Navbar.svelte';
</script>

<svelte:head><title>Lynx City Twin</title></svelte:head>

<div class="app" transition:fade>
	<Navbar />
	<slot />

	<div class="bg-dark py-8" />
	<Footer />
</div>
