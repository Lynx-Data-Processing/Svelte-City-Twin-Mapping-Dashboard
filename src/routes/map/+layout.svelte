<script>
	import Footer from '$lib/layout/Footer.svelte';
	import Navbar from '$lib/layout/Navbar.svelte';
	import '../../styles/style.css';
</script>


<Navbar />
<div class="main">
	<slot />
	<Footer />
</div>

