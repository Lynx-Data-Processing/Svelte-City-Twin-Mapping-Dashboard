<script lang="ts">
	import { mapStore } from '../store/mapStore';
	import { searchParamStore } from '../store/searchParamsStore';
	import type { ISeachParameters } from '../types';

	let searchParameters: ISeachParameters;
	searchParamStore.subscribe((value) => {
		searchParameters = value.searchParameters;
	});

	let map: google.maps.Map | undefined;
	mapStore.subscribe((value) => {
		map = value.map;
	});

	function handleSearch() {
		if (map) {
			const bounds = map.getBounds();
			if (bounds) {
				const ne = bounds.getNorthEast();
				const sw = bounds.getSouthWest();

				// Create a polygon array based on the bounding box
				const polygon = [
					[sw.lat(), sw.lng()],
					[ne.lat(), sw.lng()],
					[ne.lat(), ne.lng()],
					[sw.lat(), ne.lng()]
				];

				// Convert the polygon array to a string representation
				searchParameters.location = JSON.stringify(polygon);

				// Trigger the search action here, e.g., call an API or update the store
			}
		}
	}
</script>

<div class="flex flex-col gap-4 p-4">
	<!-- Date Start Input -->
	<label class="flex flex-col">
		<span>Date Start</span>
		<input
			type="datetime-local"
			bind:value={searchParameters.dateStart}
			class="px-4 py-2 border-[1px] rounded-md"
		/>
	</label>

	<!-- Date End Input -->
	<label class="flex flex-col">
		<span>Date End</span>
		<input
			type="datetime-local"
			bind:value={searchParameters.dateEnd}
			class="px-4 py-2 border-[1px] rounded-md"
		/>
	</label>


	<!-- Model Input -->
	<label class="flex flex-col">
		<span>Model</span>
		<input
			disabled={true}
			type="text"
			bind:value={searchParameters.model}
			class="px-4 py-2 border-[1px] rounded-md"
		/>
	</label>

	<!-- Return Video Checkbox -->
	<label class="flex items-center">
		<input type="checkbox" bind:checked={searchParameters.returnVideo} class="mr-2" />
		<span>Return Video</span>
	</label>

	<button on:click={handleSearch} title="Search" class="bg-dark hover:bg-zinc-800 text-white p-2 w-full h-10 rounded-md">
		<i class="fa-solid fa-magnifying-glass" aria-hidden="true" />
	</button>
</div>
