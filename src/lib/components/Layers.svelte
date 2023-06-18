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
	let isAllVisible = false;

	const toggleAllLayers = (isVisible: boolean) => {

		const tempLayerList = layerList;
		// for all layers change the visibility
		tempLayerList.forEach((layer) => {
			layer.isVisible = isVisible;
		});

		// update the layer list
		layerList = tempLayerList;
		//Update google layers
		layerList.forEach((layer) => {
			toggleGoogleLayer(layer);
		});

		isAllVisible = isVisible;
	};

	const checkIfAllVisible = () => {
		const visibleLayers = layerList.filter((layer) => layer.isVisible);
		isAllVisible = visibleLayers.length === layerList.length;
	};

	const toggleLayer = (selectedLayer: ILayerListElementType) => {
		const index = layerList.findIndex((layer) => layer.layerName === selectedLayer.layerName);
		layerList[index].isVisible = !layerList[index].isVisible;
		toggleGoogleLayer(layerList[index]);

		if (layerList[index].isVisible)
			updateMapCenter(selectedLayer.initialCoordinates, selectedLayer.type);

		checkIfAllVisible();
	};

	const filterLayersBySearch = () => {
		if (isEmptyString(search)) {
			filteredLayers = layerList;
			return;
		}
		filteredLayers = layerList.filter((layer) =>
			layer.layerName.toLowerCase().includes(search.toLowerCase())
		);
	};

	$: layerList && filterLayersBySearch();
</script>

<div class="flex flex-col px-4 py-4 gap-2">
	<div class="flex flex-row gap-2">
		<SearchBar onChangeFunction={filterLayersBySearch} bind:search />

		{#if isAllVisible}
			<button
				title = "Hide All Layers"
				class="btn btn-black-outline w-32 btn-text-center"
				on:click={() => toggleAllLayers(false)}
			>
				<i class="fas fa-eye-slash icon-color" />
			
			</button>
		{:else}
			<button
				title = "Show All Layers"
				class="btn btn-black-outline w-32 btn-text-center"
				on:click={() => toggleAllLayers(true)}
			>
				<i class="fas fa-eye icon-color" />
				
			</button>
		{/if}
	</div>

	{#if layerList.length != 0 && filteredLayers.length === 0}
		<div class="alert alert-error">
			<p>Your search - {search} - did not match any Layers</p>
		</div>
	{:else}
		<div class="flex flex-col max-h-96 overflow-auto gap-2 {filteredLayers.length > 5 ? "pr-4":""}">
			{#each filteredLayers as layer}
				<div class="flex flex-row gap-2">
					<button
						on:click={() => {
							updateMapCenter(layer.initialCoordinates, layer.type);
						}}
						class="btn btn-black-outline w-16 btn-text-center"
						><i class={`${layer.icon} icon-color`} style="color: {layer.color};" /></button
					>
					<button
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
	{/if}

	<div class="flex flex-col justify-end">
		<div class="text-right">
			<p>Showing {filteredLayers.length} of {layerList.length} Layers</p>
		</div>
	</div>
</div>
