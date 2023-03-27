<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import '../styles/style.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: ({ supabase } = data);

	onMount(() => {
		// On page load/refresh, check if the user is logged in
		const { data } = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		// If the user is logged in, redirect to the dashboard
		return () => data.subscription.unsubscribe();
	});
</script>

<div class="app" in:fade={{ duration: 500 }}>
	<slot />
</div>
