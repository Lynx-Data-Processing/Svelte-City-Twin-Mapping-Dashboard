<script lang="ts">
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { mapLayerStore } from '$lib/features/map/store/layerListStore';
	import { isColor, isNumber, stringifyObject } from '$lib/utils/value-type';
	import { convertGeoJSONToLatLng } from '../helpers/geojson/geojson-utils';
	import { mapStore } from '../store/mapStore';
	import type { IGeojsonFeature, IMapLayer } from '../types';
	import DownloadButton from './layers/DownloadButton.svelte';
	import UpdateCenterButton from './layers/UpdateCenterButton.svelte';

	let mapLayers: IMapLayer[];
	let selectedLayer: IMapLayer;
	let selectedLayerGeojson: any = null;
	let uniqueKeys: Set<string> = new Set();
	let columnFilters: Record<string, any> = {};

	mapLayerStore.subscribe((value) => {
		mapLayers = value.mapLayers;
	});

	let map: google.maps.Map;
	mapStore.subscribe((value) => {
		map = value.map;
	});

	const selectLayer = (layer: IMapLayer) => {
		selectedLayer = layer;

		if (selectedLayer && selectedLayer.geojson) {
			uniqueKeys = new Set();
			selectedLayer.geojson.features.forEach((feature) => {
				Object.keys(feature.properties).forEach((key) => uniqueKeys.add(key));
			});

			selectedLayerGeojson = selectedLayer.geojson;

			// Populate filters for non-numerical columns
			uniqueKeys.forEach((key) => {
				const uniqueValues = new Set();
				selectedLayerGeojson.features.forEach((feature: IGeojsonFeature) => {
					uniqueValues.add(feature.properties[key]);
				});

				if (![...uniqueValues].every((v) => typeof v === 'number')) {
					columnFilters[key] = { values: Array.from(uniqueValues), selectedValue: 'All' };
				}
			});

			filterGeojsonBySearch();
		}
	};
	$: selectLayer(selectedLayer);

	let search = '';
	let filteredLayerGeojson: any = null;
	const filterGeojsonBySearch = () => {
		if (!search || search === '') {
			filteredLayerGeojson = selectedLayerGeojson;
			return;
		}

		filteredLayerGeojson = {
			...selectedLayerGeojson,
			features: selectedLayerGeojson.features.filter((feature: any) => {
				for (const key in feature.properties) {
					const value = feature.properties[key];
					if (typeof value === 'string' && value.toLowerCase().includes(search.toLowerCase())) {
						return true;
					}
				}
				return false;
			})
		};
	};
	
	let sortDirection: 'asc' | 'desc' | null = null;
	let sortedByColumn: string | null = null;
	const sortTable = (columnKey: string) => {
		if (sortedByColumn === columnKey) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortedByColumn = columnKey;
			sortDirection = 'asc';
		}

		if (selectedLayerGeojson && selectedLayerGeojson.features) {
			let tempGeojson = selectedLayerGeojson;
			const sortedFeatures = [...tempGeojson.features].sort((a, b) => {
				const aValue = a.properties[columnKey];
				const bValue = b.properties[columnKey];
				if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
				if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
				return 0;
			});
			tempGeojson.features = sortedFeatures;
			selectedLayerGeojson = tempGeojson;
			filterGeojsonBySearch();
		}
	};
</script>

<div class="flex flex-col p-4 gap-2">
	<select class="h-10 px-2 rounded-md hover:bg-zinc-200" bind:value={selectedLayer}>
		<option value="" disabled>Select a layer</option>
		{#each mapLayers as layer}
			<option value={layer}>{layer.layerName}</option>
		{/each}
	</select>

	{#if selectedLayer}
		<SearchBar
			onChangeFunction={filterGeojsonBySearch}
			bind:search
			placeholder={'Search Map Layer Features...'}
		/>
	{/if}
	{#if filteredLayerGeojson && filteredLayerGeojson.features.length > 0}
		<div class="flex flex-col max-h-[25rem] overflow-auto pr-6 pb-6">
			<table class="w-full border-collapse rounded-md overflow-hidden">
				<thead>
					<tr class="text-left bg-zinc-200 rounded-md overflow-hidden h-10">
						
						{#each Array.from(uniqueKeys) as key, idx}
							<th class="font-bold p-2">
								<div class="flex flex-row gap-2">
									{key}

									<button on:click={() => sortTable(key)} class="btn btn-sm">
										{#if sortedByColumn === key && sortDirection === 'asc'}
											<i class={`fa-solid fa-arrow-up `} />
										{:else}
											<i class={`fa-solid fa-arrow-down `} />
										{/if}
									</button>
								</div>
							</th>
						{/each}
						<th class="font-bold p-2">Options</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredLayerGeojson.features as feature, idx}
						<tr class="{idx % 2 == 0 ? 'bg-white ' : 'bg-zinc-50'} hover:bg-zinc-100 h-10">
							
							{#each Array.from(uniqueKeys) as key}
								<td class="p-2">
									{#if !feature.properties[key]}
										-
									{:else if isColor(feature.properties[key])}
										<span class="flex flex-row gap-2" style="color: {feature.properties[key]};">
											<span
												class="rounded-full h-4 w-4"
												style="background-color: {feature.properties[key]};"
											/>
											{feature.properties[key]}
										</span>
									{:else if isNumber(feature.properties[key])}
										<span>{feature.properties[key]}</span>
									{:else}
										<span>{stringifyObject(feature.properties[key])}</span>
									{/if}
								</td>
							{/each}
							<td class="p-2">
								<UpdateCenterButton
									extraClasses={'rounded-md'}
									initialCoordinates={convertGeoJSONToLatLng(feature)}
									geojsonGeometry={feature.geometry.type}
									{map}
								/>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	{#if filteredLayerGeojson && filteredLayerGeojson.features.length > 0}
		<div class="border-[1px] rounded-md h-fit w-full bg-white mt-4">
			<DownloadButton layer={selectedLayer} />
		</div>
	{/if}
</div>
