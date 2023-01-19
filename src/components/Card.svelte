<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition';
	export let title: string;
	export let width = 'w-full';
	export let disableToggle = false;
	export let showOnLoad = true;
	let showTerms = showOnLoad;
	const toggleTerms = () => {
		showTerms = !showTerms;
	};
</script>

<section in:fade out:fly={{ x: 200 }} class="card h-fit  {width} p-4">
	<div class="flex flow-row justify-between my-1">
		<div>
			<p class="text-lg font-bold">{title}</p>
		</div>

		{#if !disableToggle}
			<div>
				<button on:click={toggleTerms} class="toggle-btn text-center hover:underline">
					{#if showTerms}
						<i class="fa-solid fa-minus" />
						<span>Hide</span>
					{:else}
						<i class="fa-solid fa-plus" />
						<span>Show</span>
					{/if}
				</button>
			</div>
		{/if}
	</div>

	{#if showTerms || disableToggle}
		<div transition:slide={{ duration: 400 }}>
			<slot />
		</div>
	{/if}
</section>
