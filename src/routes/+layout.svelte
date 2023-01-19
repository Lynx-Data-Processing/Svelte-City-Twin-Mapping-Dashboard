<script>
	import { fade, slide } from 'svelte/transition';
	import '../styles/style.css';
	import Footer from '../widgets/Footer.svelte';
	import Navbar from '../widgets/Navbar.svelte';
</script>

<div class="app" transition:fade>
	<Navbar />
	<slot />
	<Footer />
</div>
