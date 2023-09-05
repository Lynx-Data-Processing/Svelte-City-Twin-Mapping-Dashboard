<script lang="ts">
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import type { ILayerListElementType } from '$lib/types/mapTypes';
	import { isEmptyString } from '$lib/utils/is-emptyString';
	import IconButton from '../ui/IconButton.svelte';

	export let toggleGoogleLayer: Function;
	export let updateMapCenter: Function;
	export let layerList: ILayerListElementType[];
	let filteredLayers: ILayerListElementType[] = layerList;
	let selectedLayer: ILayerListElementType | null = null;
	let search = '';
	let isAllVisible = false;

	const toggleAllLayers = () => {
		const isVisible = !isAllVisible;
		const tempLayerList = layerList;
		tempLayerList.forEach((layer) => {
			layer.isVisible = isVisible;
		});

		layerList = tempLayerList;
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

<div class="flex flex-col p-4 gap-2">
	<div class="flex flex-row gap-2">
		{#if isAllVisible}
			<IconButton
				title={'Hide Layers'}
				icon="fas fa-eye-slash"
				onClickHandle={toggleAllLayers}
				size={'h-10 w-10'}
			/>
		{:else}
			<IconButton
				title={'Show Layers'}
				icon="fas fa-eye"
				onClickHandle={toggleAllLayers}
				size={'h-10 w-10'}
			/>
		{/if}

		<SearchBar onChangeFunction={filterLayersBySearch} bind:search />
	</div>

	{#if filteredLayers.length}
		<div class="flex flex-col max-h-96 overflow-auto gap-2 py-2 ">
			{#each filteredLayers as layer}
				<div class="flex flex-row gap-2">
					<IconButton
						title={'Toggle Layer'}
						icon={layer.icon}
						iconColor={layer.color}
						size={'h-10 w-10'}
						onClickHandle={() => {}}
					/>

					<button
						title={layer.layerName}
						on:click={() => toggleLayer(layer)}
						class="flex flex-row px-4 py-2 border-[1px] rounded-md w-full h-10 {layer.isVisible
							? 'bg-primary text-white hover:bg-primary-dark'
							: 'bg-white hover:bg-smoke'}"
					>
						<p class="my-auto">{layer.layerName}</p>
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<div class="mt-auto p-4 flex flex-row bg-smoke  justify-end">
	<p>Showing {filteredLayers.length} of {layerList.length} Layers</p>
</div>
