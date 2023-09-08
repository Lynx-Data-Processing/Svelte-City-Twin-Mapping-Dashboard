<script lang="ts">
	import { onMount } from 'svelte';
	import {
		addAdditionalStylingToGeojson,
		convertToGeojson
	} from '../helpers/geojson/geojson-utils';
	import { createMapLayer } from '../helpers/google/google-map-utils';
	import { getQueensData } from '../services/queens';
	import { mapStore } from '../store/mapStore';
	import { searchParamStore } from '../store/searchParamsStore';
	import type { IMapLayer, ISeachParameters } from '../types';

	let searchParameters: ISeachParameters;
	searchParamStore.subscribe((value) => {
		searchParameters = value.searchParameters;
	});

	let map: google.maps.Map | undefined;
	mapStore.subscribe((value) => {
		map = value.map;
	});

	let isSuccessful = false;
	let showStatus = false;
	export let processMapLayers: Function;

	async function handleSearch() {
		if (map) {
			const bounds = map.getBounds();
			if (bounds) {
				const ne = bounds.getNorthEast();
				const sw = bounds.getSouthWest();
				const polygon = [
					[sw.lat(), sw.lng()],
					[ne.lat(), sw.lng()],
					[ne.lat(), ne.lng()],
					[sw.lat(), ne.lng()]
				];
				searchParameters.location = JSON.stringify(polygon);

				// Convert the polygon array to a string representation
				searchParameters.location = JSON.stringify(polygon);

				try {
					let data = await getQueensData(searchParameters);
					let geojson = addAdditionalStylingToGeojson(
						convertToGeojson(data, 'Point'),
						'#3f51b5',
						false
					);
					processMapLayers([
						createMapLayer('Queens Data', 'Point', true, 'fa-solid fa-camera', '#3f51b5', geojson)
					]);

					isSuccessful = true;
				} catch (error) {
					isSuccessful = false;
				}

				showStatus = true;
				setTimeout(() => (showStatus = false), 3000);
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

	{#if showStatus}
		<div
			class="{isSuccessful
				? 'bg-green-800'
				: 'bg-red-800'} flex text-white p-2 w-full h-10 rounded-md text-center align-middle"
		>
			<p class="m-auto">{isSuccessful ? 'Search Successful' : 'Search Failed'}</p>
		</div>
	{:else}
		<button
			on:click={handleSearch}
			title="Search"
			class="bg-dark hover:bg-zinc-800 text-white p-2 w-full h-10 rounded-md"
		>
			<i class="fa-solid fa-magnifying-glass" aria-hidden="true" />
		</button>
	{/if}
</div>
