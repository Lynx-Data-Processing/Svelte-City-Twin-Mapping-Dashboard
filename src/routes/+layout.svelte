<script lang="ts">
	import '../styles/style.css';
	import { fade } from 'svelte/transition';
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	import type { LayoutData } from './$types'
	
	export let data: LayoutData

	$: ({ supabase } = data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		})

		return () => data.subscription.unsubscribe();
	})
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="app" transition:fade>
	<slot />
</div>