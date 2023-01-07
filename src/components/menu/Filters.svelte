<script>
	import RangeSlider from 'svelte-range-slider-pips';
	export let gpsFilters;
	export let gpsData;

	// Reset filters to default values when user clicks on reset button
	const resetFilters = () => {
		if (!gpsData.length) return;

		let tempArray = gpsFilters;
		for (let i = 0; i < tempArray.length; i += 1) {
			tempArray[i].selected[0] = tempArray[i].default[0];
			tempArray[i].selected[1] = tempArray[i].default[1];
		}
		gpsFilters = tempArray;
	};
</script>

<div class="flex flex-row">
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

		<button on:click={resetFilters} class={`btn  btn-black-outline my-1 `}>
			Reset All Filters
		</button>
	{:else}
		<div class="alert alert-red my-1" role="alert">GPS Data has not been loaded.</div>
	{/if}
</div>
