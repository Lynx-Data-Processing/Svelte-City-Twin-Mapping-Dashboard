<script lang="ts">
	import SearchBar from '$lib/components/SearchBar.svelte';
	import type { IFontAwesomeIconGivenGeojsonType } from '$lib/types/geojsonTypes';
	import type { ILayerListElementType } from '$lib/types/mapTypes';

	export let updateMapCenter: Function;
	export let layerList: ILayerListElementType[] = [];
	let visibleLayers: ILayerListElementType[] = layerList;
	let searchText: String = '';

	let showAllLayers = false;
	const toggleLayers = () => {
		try {
			layerList.forEach((layer) => (layer.isShown = showAllLayers));
			showAllLayers = !showAllLayers;
			filterLayersBySearch();
		} catch (error) {
			console.log(error);
		}
	};
	const toggleLayer = (selectedLayer: ILayerListElementType) => {
		try {
			const index = layerList.findIndex((layer) => layer.layerName === selectedLayer.layerName);
			layerList[index].isShown = !layerList[index].isShown;
			if (checkIfAllLayersAreSame()) {
				showAllLayers = !layerList[index].isShown;
			}
			filterLayersBySearch();
		} catch (error) {
			console.log(error);
		}
	};
	const checkIfAllLayersAreSame = () => {
		return layerList.every((element) => element.isShown === layerList[0].isShown);
	};

	const filterLayersBySearch = () => {
		try {
			const tempSearch = searchText.trim().replace(/[^\w\s]/gi, '');
			const expr = new RegExp(tempSearch, 'gi');
			visibleLayers = layerList.filter((layer) => expr.test(layer.layerName));
		} catch (error) {
			console.log(error);
		}
	};

	$: layerList && filterLayersBySearch();
</script>

<div class="flex flex-col">
	{#if layerList.length}
		<button
			on:click={toggleLayers}
			class={`btn   ${showAllLayers ? 'btn-primary' : 'btn-error-outline'}  my-1 `}
		>
			{showAllLayers ? 'Show All' : 'Disable All'}
		</button>

		<div class="my-1 flex flex-row gap-4">
			<SearchBar onChangeFunction={filterLayersBySearch} bind:searchText />
		</div>

		<div class="flex flex-col ">
			{#each visibleLayers as layer}
				<div class="flex flex-row gap-4  my-1">
					<button
						on:click={() => toggleLayer(layer)}
						class={`btn w-full ${layer.isShown ? 'btn-primary' : 'btn-black-outline'} `}
					>
						<i class="fa-solid {layer.icon} " />
						<span>{layer.layerName}</span>
					</button>

					<button
						on:click={() => {
							updateMapCenter(layer.initialCoordinates, layer.type);
						}}
						class="btn btn-black-outline w-16 btn-text-center"
						><i
							class={`${layer.type} icon-color`}
							style={`--sent-color: ${layer.color}`}
						/></button
					>
				</div>
			{/each}
		</div>
	{:else}
		<div class="alert alert-green my-1" role="alert">Loading Data.</div>
	{/if}
</div>
