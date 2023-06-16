<script>
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { fade } from 'svelte/transition';
	import '../../styles/style.css';
</script>

<div transition:fade>
	<Header />

	<div class="pt-16">
		<slot />
	</div>
	
	<Footer />
</div>
