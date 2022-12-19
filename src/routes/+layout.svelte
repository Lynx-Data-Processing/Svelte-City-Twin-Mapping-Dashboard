<script>
	import Navbar from '../widgets/Navbar.svelte';
	import '../styles/styles.css';
	import Footer from '../widgets/Footer.svelte';
</script>

<div class="app">

	<Navbar />

	<slot />

	<Footer />
</div>
