<script lang="ts">
	import { mapLayerStore } from '../store/layerListStore';
	import type { IMapLayer } from '../types';
	let selectedLayer: IMapLayer;
	let mapLayers: IMapLayer[];
	mapLayerStore.subscribe((value) => {
		mapLayers = value.mapLayers;
	});

	let propertyFilters: Record<string, any> = {};
	const selectLayer = (layer: IMapLayer) => {
		selectedLayer = layer;
		if (selectedLayer && selectedLayer.geojson) {
			const tempGeojson = selectedLayer.geojson;
			if (!tempGeojson) return;

			//Read all unique properties and add them to the propertyFilters array
            const tempFilters: Record<string, any> = {};
			tempGeojson.features.forEach((feature) => {
				Object.keys(feature.properties).forEach((key) => {
					if (!tempFilters[key]) {
						tempFilters[key] = {
							values: new Set(),
							selectedValue: 'All'
						};
					}
					tempFilters[key].values.add(feature.properties[key]);
				});
			});

            propertyFilters = tempFilters;

			console.log(propertyFilters);
		}
	};
	$: selectLayer(selectedLayer);
</script>

<div class="flex flex-col p-4 gap-2">
	<select class="h-10 px-2 rounded-md hover:bg-zinc-200" bind:value={selectedLayer}>
		<option value="" disabled>Select a layer</option>
		{#each mapLayers as layer}
			<option value={layer}>{layer.layerName}</option>
		{/each}
	</select>

	{#if propertyFilters && Object.keys(propertyFilters).length > 0}
		<div class="flex flex-col gap-2 max-h-[25rem] overflow-auto pr-6 pb-6">
			{#each Object.keys(propertyFilters) as key}
				<label class="flex flex-col">
					<span class="font-bold mb-2">{key}</span>
					<select
						class="h-10 px-2 rounded-md hover:bg-zinc-200"
						bind:value={propertyFilters[key].selectedValue}
					>
						<option value="All">All</option>
						{#each Array.from(propertyFilters[key].values) as value}
							<option {value}>{value}</option>
						{/each}
					</select>
				</label>
			{/each}
		</div>
	{/if}
</div>
