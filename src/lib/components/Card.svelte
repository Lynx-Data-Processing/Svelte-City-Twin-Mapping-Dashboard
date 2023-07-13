<script lang="ts">
	import { slide } from 'svelte/transition';
	export let title: string;
	export let icon = 'fa-solid fa-diamond';
	export let width = 'w-full';
	export let disableToggle = false;
	export let isRounded = true;
	export let showOnLoad = true;
	export let showContent = showOnLoad;
	const toggleContent = () => showContent = !showContent;
</script>

<section class="card  h-fit card-shadow  {width}  gap-4 {isRounded ? 'rounded-sm' : ''}">
	<div class="flex flow-row justify-between bg-dark bg-grid px-4 py-2 {isRounded ? 'rounded-sm' : ''}">
		<div class=" flex flex-row gap-2 align-middle ">
			<i class={`${icon} icon-color my-auto`} />
			<p class="text-subtitle my-auto">{title}</p>
		</div>

		{#if !disableToggle}
			<button on:click={toggleContent} class="toggle-btn text-center">
				<div class="flex flex-row gap-2 align-middle ">

				
				{#if showContent}
					<i class="fa-solid fa-minus" />
					<p>Hide</p>
				{:else}
					<i class="fa-solid fa-plus" />
					<p>Show</p>
				{/if}
			</div>
			</button>
		{/if}
	</div>
	{#if showContent || disableToggle}
		<div transition:slide>
			<slot />
		</div>
	{/if}
</section>
