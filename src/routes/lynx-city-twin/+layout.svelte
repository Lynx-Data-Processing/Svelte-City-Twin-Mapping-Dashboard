<script>

	import BottomFooter from '$lib/widgets/BottomFooter.svelte';
	import Navbar from '$lib/widgets/Navbar.svelte';
	import { fade } from 'svelte/transition';
	import '../../styles/style.css';
</script>



<div class="app" transition:fade>
	<Navbar />
	<slot />

	<div class="bg-dark py-8" />
	<BottomFooter />
</div>
