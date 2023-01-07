<script>
	import '../styles/style.css';
	import Footer from '../widgets/Footer.svelte';
	import Navbar from '../widgets/Navbar.svelte';
</script>

<div class="app">
	<Navbar />

	<slot />

	<Footer />
</div>
