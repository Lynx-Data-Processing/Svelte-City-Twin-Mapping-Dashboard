<script lang="ts">
	export let title: string;
	export let width = 'w-[32rem]';
	export let disableToggle = false;
	export let showOnLoad = false;
	let showTerms = showOnLoad;
	const toggleTerms = () => {
		showTerms = !showTerms;
	};
</script>

<section class="card h-fit  {width} p-4">
	<div class="flex flow-row justify-between my-1">
		<div>
			<p class="font-bold">{title}</p>
		</div>

		{#if !disableToggle}
			<div>
				<button on:click={toggleTerms} class="toggle-btn text-center hover:underline">
					{#if showTerms}
						<i class="fa-solid fa-arrow-up" />
						<span>Hide</span>
					{:else}
						<i class="fa-solid fa-arrow-down" />
						<span>Show</span>
					{/if}
				</button>
			</div>
		{/if}
	</div>

	{#if showTerms || disableToggle}
		<slot />
	{/if}
</section>
