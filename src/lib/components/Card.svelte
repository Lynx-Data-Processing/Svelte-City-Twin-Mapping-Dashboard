<script lang="ts">
	import { fly, slide } from 'svelte/transition';
	import Underline from './Underline.svelte';
	export let title: string;
	export let width = 'w-full';
	export let disableToggle = false;
	export let isRounded = true;
	export let showOnLoad = true;
	let showContent = showOnLoad;
	const toggleContent = () => {
		showContent = !showContent;
	};
</script>

<section  class="card  h-fit  {width} p-4 gap-4 {isRounded ? "rounded-md" : ""}">
	<div class="flex flow-row justify-between">
		<div class="flex flex-col">
			<p class="text-subtitle ">{title}</p>
			
		</div>
		
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
		<div class="mt-2" transition:slide>
			<slot />
		</div>
	{/if}
</section>
