<script lang="ts">
	export let title: string;
	export let icon: string;
	export let width = 'w-full';
	export let disableToggle = false;
	export let showOnLoad = true;
	export let showContent = showOnLoad;
	export let extraClasses = '';
	export let dividerColor = 'bg-primary';
	const toggleContent = () => (showContent = !showContent);
</script>

<section class="bg-white h-fit shadow-lg {width} gap-2 rounded-md overflow-hidden {extraClasses}">
	<div class="flex flex-row justify-between bg-dark text-white px-4 py-3 ">
		<div class="flex gap-2">
			<i class="{icon} my-auto" />
			<p class="text-subtitle my-auto">{title}</p>
		</div>
		{#if !disableToggle}
			<button on:click={toggleContent} class="flex flow-row gap-2">
				<i class="{showContent ? 'fa-solid fa-minus' : 'fa-solid fa-plus'} my-auto" />
				<p class="my-auto">{showContent ? 'Hide' : 'Show'}</p>
			</button>
		{/if}
	</div>
	<div class="{dividerColor} py-0.5"/>
	{#if showContent || disableToggle}
		<slot />
	{/if}
</section>
