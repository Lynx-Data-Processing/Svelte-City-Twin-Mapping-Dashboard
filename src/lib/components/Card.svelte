<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition';
	export let title: string;
	export let width = 'w-full';
	export let disableToggle = false;
	export let showOnLoad = true;
	let showContent = showOnLoad;
	const toggleContent = () => {
		showContent = !showContent;
	};
</script>

<section in:fly={{ x: -200 }} class="card shadow-md h-fit  {width} p-4 gap-4 rounded-lg">
	<div class="flex flow-row justify-between">
		<p class="card-title">{title}</p>

		{#if !disableToggle}
			<button on:click={toggleContent} class="toggle-btn text-center hover:underline">
				{#if showContent}
					<i class="fa-solid fa-minus" />
					<span>Hide</span>
				{:else}
					<i class="fa-solid fa-plus" />
					<span>Show</span>
				{/if}
			</button>
		{/if}
	</div>
	{#if showContent || disableToggle}
		<div class="mt-2" in:slide >
			<slot />
		</div>
	{/if}
</section>
