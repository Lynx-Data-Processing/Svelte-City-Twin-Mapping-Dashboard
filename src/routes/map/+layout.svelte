<script>

	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { fade } from 'svelte/transition';
	import '../../styles/style.css';
</script>



<div class="app" transition:fade>
	<Header />
	<slot />

	<div class="bg-dark py-8" />
	<Footer />
</div>
