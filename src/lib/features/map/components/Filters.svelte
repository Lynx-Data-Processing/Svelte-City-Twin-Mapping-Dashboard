<script lang="ts">
	import { filterGoogleMapLayerGeojsonWithoutUpdatingLayerGeojson } from '../helpers/google/google-map-utils';
	import { mapLayerStore } from '../store/layerListStore';
	import { mapStore } from '../store/mapStore';
	import type { IFilters, IMapLayer } from '../types';
	let selectedLayer: IMapLayer;
	let mapLayers: IMapLayer[];
	mapLayerStore.subscribe((value) => {
		mapLayers = value.mapLayers;
	});

	let map: google.maps.Map | undefined;
	mapStore.subscribe((value) => {
		map = value.map;
	});

	let filters: IFilters[] = [];

	const selectLayer = (layer: IMapLayer) => {
		if (!layer) return;
		selectedLayer = layer;
		
		filters = selectedLayer.filters;
	};
	$: selectLayer(selectedLayer);

	const filterGeojsonData = () => {
		if (!selectedLayer || !selectedLayer.geojson) return;

		// Create a deep copy of the original geojson
		const tempGeojson = JSON.parse(JSON.stringify(selectedLayer.geojson));

		// For every filter, filter the geojson features
		selectedLayer.filters.forEach((filter) => {
			const selectedValue = filter.selectedValue;
			if (selectedValue === 'All') return;

			tempGeojson.features = tempGeojson.features.filter((feature: { properties: any }) => {
				const properties = feature.properties;
				if (!properties) return false;

				const value = properties[filter.name];
				if (value === selectedValue) return true;
				return false;
			});
		});

		map = filterGoogleMapLayerGeojsonWithoutUpdatingLayerGeojson(map, selectedLayer, tempGeojson);
	};

	const resetFilters = () => {
		if (!selectedLayer || !selectedLayer.geojson) return;

		// Reset the filters
		selectedLayer.filters.forEach((filter) => {
			filter.selectedValue = 'All';
		});

		filters = selectedLayer.filters;

		// Reset the map layer
		map = filterGoogleMapLayerGeojsonWithoutUpdatingLayerGeojson(
			map,
			selectedLayer,
			selectedLayer.geojson
		);
	};
</script>

<div class="flex flex-col p-4 gap-2">
	<select class="h-10 px-2 rounded-md hover:bg-zinc-200" bind:value={selectedLayer}>
		<option value="" disabled>Select a layer</option>
		{#each mapLayers as layer}
			<option value={layer}>{layer.layerName}</option>
		{/each}
	</select>

	{#if selectedLayer && filters}
		{#each filters as filter}
			<label class="flex flex-col gap-2">
				<span class="font-bold">{filter.name}</span>
				<select class="h-10 px-2 rounded-md hover:bg-zinc-200" bind:value={filter.selectedValue}>
					<option value="All">All</option>
					{#each filter.values as value}
						<option {value}>{value}</option>
					{/each}
				</select>
			</label>
		{/each}

		<div class="flex flex-row gap-2 mt-4">
			<button
				on:click={resetFilters}
				title="Reset Filters"
				class="border-[1px] hover:bg-zinc-200  p-2 w-full h-10 rounded-md"
			>
				<i class="fa-solid fa-clock-rotate-left" aria-hidden="true" />
			</button>

			<button
				on:click={filterGeojsonData}
				title="Apply Filters"
				class="bg-dark hover:bg-zinc-800 text-white p-2 w-full h-10 rounded-md"
			>
				<i class="fa-solid fa-filter" aria-hidden="true" />
			</button>
		</div>
	{/if}
</div>
