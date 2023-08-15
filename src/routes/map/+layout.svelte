<script>
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { fade } from 'svelte/transition';
	import '../../styles/style.css';
</script>
<Navbar />
<div class="main">
	<slot />
	<Footer />
</div>

