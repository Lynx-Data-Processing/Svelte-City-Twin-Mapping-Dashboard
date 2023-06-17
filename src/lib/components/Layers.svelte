<script lang="ts">
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { TRIP, TRIP_EVENT } from '$lib/types/eventTypes';
	import type { ILayerListElementType } from '$lib/types/mapTypes';
	import { isEmptyString } from '$lib/utils/is-emptyString';

	export let toggleGoogleLayer: Function;
	export let updateMapCenter: Function;
	export let layerList: ILayerListElementType[];
	let filteredLayers: ILayerListElementType[] = layerList;
	let search = '';

	const toggleLayer = (selectedLayer: ILayerListElementType) => {
		const index = layerList.findIndex((layer) => layer.layerName === selectedLayer.layerName);
		layerList[index].isVisible = !layerList[index].isVisible;
		toggleGoogleLayer(layerList[index]);

		if (layerList[index].isVisible)
			updateMapCenter(selectedLayer.initialCoordinates, selectedLayer.type);
	};

	const filterLayersBySearch = () => {
		if (isEmptyString(search)) {
			filteredLayers = layerList;
			return;
		}

		const tempSearch = search.trim().replace(/[^\w\s]/gi, '');
		const expr = new RegExp(tempSearch, 'gi');
		filteredLayers = layerList.filter((layer) => expr.test(layer.layerName));
	};

	const getToolTipText = (layer: ILayerListElementType) => {
		const tripEvent = layer.tripEvent; // convert to lowercase for case-insensitive comparison

		if(tripEvent === TRIP) {
			return 'Trips collected through the Smarter AI Dashboard Camera and stored in the Smarter AI Cloud';
		}

		if(tripEvent === TRIP_EVENT) {
			return 'Events are generated when the Smarter AI Dashboard Camera detects an incident such as a collision, stop sign, tailgating or hard braking event.';
		}

		if(tripEvent === 'neighborhood') {
			return "Boundaries of neighbourhoods within the City of Kingston, Ontario, as established from the 2016 census dissemination areas. Includes neighbourhood names."
		}

		
		return 'Layer represents ' + layer.layerName + ' data collected by the Sheridan College Team';
	};

	$: layerList && filterLayersBySearch();
</script>

<div class="flex flex-col gap-2 px-4 py-4">
	<div class="flex flex-row ">
		<SearchBar onChangeFunction={filterLayersBySearch} bind:search />
	</div>

	<div class="flex flex-col max-h-64 overflow-auto gap-2 pr-8">
		{#each filteredLayers as layer}
			<div class="flex flex-row gap-2">
				<button title="{getToolTipText(layer)}"
					on:click={() => {
						updateMapCenter(layer.initialCoordinates, layer.type);
					}}
					class="btn btn-black-outline w-16 btn-text-center"
					><i class={`${layer.icon} icon-color`} style="color: {layer.color};" /></button
				>
				<button title="{getToolTipText(layer)}"
					on:click={() => {
						toggleLayer(layer);
					}}
					class={`btn w-full ${layer.isVisible ? 'btn-primary' : 'btn-black-outline'} `}
				>
				
					<span>{layer.layerName}</span>
				</button>
			</div>
		{/each}
	</div>
</div>
