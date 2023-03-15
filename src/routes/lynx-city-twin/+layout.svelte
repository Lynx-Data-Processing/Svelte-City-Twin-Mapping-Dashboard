<script>

	import BottomFooter from '$lib/components/BottomFooter.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { fade } from 'svelte/transition';
	import '../../styles/style.css';
</script>



<div class="app" transition:fade>
	<Navbar />
	<slot />

	<div class="bg-dark py-8" />
	<BottomFooter />
</div>
