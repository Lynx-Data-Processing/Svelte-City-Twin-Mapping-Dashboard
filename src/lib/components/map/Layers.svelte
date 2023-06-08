<script lang="ts">
	import SearchBar from '$lib/components/SearchBar.svelte';
	import type { ILayerListElementType } from '$lib/types/mapTypes';
	import { isEmptyString } from '$lib/utils/is-emptyString';

	export let toggleGoogleLayer: Function;
	export let updateMapCenter: Function;
	export let layerList: ILayerListElementType[];
	let filteredLayers: ILayerListElementType[] = layerList;

	const toggleLayer = (selectedLayer: ILayerListElementType) => {
		const index = layerList.findIndex((layer) => layer.layerName === selectedLayer.layerName);
		layerList[index].isVisible = !layerList[index].isVisible;
		toggleGoogleLayer(layerList[index]);
		filteredLayers = layerList;
	};

	const filterLayersBySearch = (search: string) => {
		if (isEmptyString(search)) {
			filteredLayers = layerList;
			return;
		}

		const tempSearch = search.trim().replace(/[^\w\s]/gi, '');
		const expr = new RegExp(tempSearch, 'gi');
		filteredLayers = layerList.filter((layer) => expr.test(layer.layerName));
	};

	$: layerList && (filteredLayers = layerList);
</script>

<div class="flex flex-col ">
	<div class="my-1 flex flex-row gap-4">
		<SearchBar onChangeFunction={filterLayersBySearch} />
	</div>

	<div class="flex flex-col max-h-96 overflow-auto">
		{#each filteredLayers as layer}
			<div class="flex flex-row gap-2  my-1">
				<button
				on:click={() => {
					updateMapCenter(layer.initialCoordinates, layer.type);
				}}
				class="btn btn-black-outline w-16 btn-text-center"
				><i class={`${layer.icon} icon-color`} style="color: {layer.color};" /></button
			>
				<button
					on:click={() => toggleLayer(layer)}
					class={`btn w-full ${layer.isVisible ? 'btn-primary' : 'btn-black-outline'} `}
				>
					<i class="{layer.icon} " />
					<span>{layer.layerName}</span>
				</button>

			
			</div>
		{/each}
	</div>
</div>
