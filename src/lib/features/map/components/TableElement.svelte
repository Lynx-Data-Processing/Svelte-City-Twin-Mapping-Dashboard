<script lang="ts">
	import { mapLayerStore } from '$lib/features/map/store/layerListStore';
	import type { IGeojsonFeature, IMapLayer } from '../types';
	import DownloadButton from './layers/DownloadButton.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';

	let mapLayers: IMapLayer[];
	let selectedLayer: IMapLayer;
	let selectedLayerGeojson: any = null;
	let uniqueKeys: Set<string> = new Set();
	let columnFilters: Record<string, any> = {};

	mapLayerStore.subscribe((value) => {
		mapLayers = value.mapLayers;
	});

	let sortDirection: 'asc' | 'desc' | null = null;
	let sortedByColumn: string | null = null;

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

	const sortTable = (columnKey: string) => {
		if (sortedByColumn === columnKey) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortedByColumn = columnKey;
			sortDirection = 'asc';
		}

		if (selectedLayerGeojson && selectedLayerGeojson.features) {
			const sortedFeatures = [...selectedLayerGeojson.features].sort((a, b) => {
				const aValue = a.properties[columnKey];
				const bValue = b.properties[columnKey];
				if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
				if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
				return 0;
			});
			selectedLayerGeojson.features = sortedFeatures;
		}
	};

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

	$: selectLayer(selectedLayer);
</script>

<div class="flex flex-col p-4 gap-2">
	<select class="h-10 px-2 rounded-md hover:bg-zinc-200" bind:value={selectedLayer}>
		<option value="" disabled>Select a layer</option>
		{#each mapLayers as layer}
			<option value={layer}>{layer.layerName}</option>
		{/each}
	</select>

	{#if selectedLayer}
		<SearchBar onChangeFunction={filterGeojsonBySearch} bind:search placeholder={"Search Features..."} />
	{/if}
	{#if filteredLayerGeojson && filteredLayerGeojson.features.length > 0}
		<div class="flex flex-col max-h-[30rem] overflow-auto pr-6 pb-6">
			<table class="w-full border-collapse rounded-md overflow-hidden">
				<thead>
					<tr class="text-left bg-zinc-200 rounded-md overflow-hidden h-10">
						<th class="font-bold px-4 py-2 w-12 ">Id</th>
						{#each Array.from(uniqueKeys) as key, idx}
							<th class="font-bold px-4 py-2 w-12">
								<div class="flex flex-row justify-between">
									{key}

									<button on:click={() => sortTable(key)} class="ml-4 btn btn-sm">
										{#if sortedByColumn === key && sortDirection === 'asc'}
											<i class={`fa-solid fa-arrow-up `} />
										{:else}
											<i class={`fa-solid fa-arrow-down `} />
										{/if}
									</button>
								</div>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each filteredLayerGeojson.features as feature, idx}
						<tr class="{idx % 2 == 0 ? 'bg-zinc-50 ' : 'bg-zinc-100'} hover:bg-zinc-300 h-10">
							<td class="px-4 py-2 font-bold">{idx}</td>
							{#each Array.from(uniqueKeys) as key}
								<td class="px-4 py-2">{feature.properties[key] ?? '-'}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	{#if filteredLayerGeojson && filteredLayerGeojson.features.length > 0}
		<div class="border-[1px] rounded-md h-fit w-full bg-white ">
			<DownloadButton layer={selectedLayer} />
		</div>
	{/if}
</div>
