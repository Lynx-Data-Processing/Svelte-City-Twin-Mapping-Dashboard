<script >
	import RangeSlider from 'svelte-range-slider-pips';
	export let gpsFilters;
	export let gpsData;

	const resetFilters = () => {
		let tempArray = gpsFilters;
		for (let i = 0; i < tempArray.length; i += 1) {
			tempArray[i].selected[0] = tempArray[i].default[0];
			tempArray[i].selected[1] = tempArray[i].default[1];
		}
		gpsFilters = tempArray;
	};

	let showTerms = true;
	const toggleTerms = () => {
		showTerms = !showTerms;
	};
</script>

<section class="card h-fit scale-in-center p-4 w-[32rem]">
	<div class="flex flow-row justify-between my-1">
		<div>
			<p>Filter:</p>
		</div>

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
	</div>

	{#if showTerms}
		{#if gpsData.length}
			{#each gpsFilters as filterItem}
				<p class=" my-1">{filterItem.name}:</p>

				<div class="py-1 px-4">
					<RangeSlider
						bind:values={filterItem.selected}
						pips
						min={filterItem.default[0]}
						max={filterItem.default[1]}
						step={filterItem.step}
						float
						suffix={filterItem.suffix}
						range
						first="label"
						last="label"
					/>
				</div>
			{/each}

			<button on:click={resetFilters} class={`card-btn  btn-black-outline my-1 `}>
				Reset All Filters
			</button>
		{:else}
			
			<div class="alert alert-red my-1" role="alert">GPS Data has not been loaded.</div>
		{/if}
	{/if}
</section>

<style>
</style>
