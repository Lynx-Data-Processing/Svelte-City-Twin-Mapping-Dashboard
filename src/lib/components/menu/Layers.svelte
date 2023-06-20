<script lang="ts">
	import SearchBar from '$lib/widgets/SearchBar.svelte';
	import Image from '$lib/widgets/Image.svelte';
	import type { ILayerListElementType } from '$lib/types/mapTypes';
	import { isEmptyString } from '$lib/utils/is-emptyString';
	import Modal from '$lib/widgets/Modal.svelte';
	import Underline from '$lib/widgets/Underline.svelte';

	export let toggleGoogleLayer: Function;
	export let updateMapCenter: Function;
	export let layerList: ILayerListElementType[];
	let filteredLayers: ILayerListElementType[] = layerList;
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

	let isModalOpen = false;
	const openModal = () => isModalOpen = true;
</script>

<Modal bind:isModalOpen title={'Layer Filters'} icon={'fa-solid fa-filter'} isRounded={false}>
	<div class="grid grid-cols-4 p-8 gap-8 max-h-[42rem] overflow-auto">
		
	</div>
</Modal>

<div class="flex flex-col">
	<div class="flex flex-col px-4 py-4 gap-2">
		<div class="flex flex-row gap-2">
			{#if isAllVisible}
				<button
					title="Hide All Layers"
					class="btn btn-black-outline w-16 btn-text-center"
					on:click={toggleAllLayers}
				>
					<i class="fas fa-eye-slash icon-color" />
				</button>
			{:else}
				<button
					title="Show All Layers"
					class="btn btn-black-outline w-16 btn-text-center"
					on:click={toggleAllLayers}
				>
					<i class="fas fa-eye icon-color" />
				</button>
			{/if}

			<SearchBar onChangeFunction={filterLayersBySearch} bind:search />

			<button class="btn btn-black-outline w-16 btn-text-center" on:click={openModal}>
				<i class="fas fa-filter icon-color" />
			</button>
		</div>

		{#if filteredLayers.length}
			<div class="flex flex-col max-h-96 overflow-auto gap-2">
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
							title={layer.layerName}
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
	</div>

	<div class="mt-auto px-4 py-4 flex flex-row bg-smoke  justify-end">
		<div>
			<p>Showing {filteredLayers.length} of {layerList.length} Layers</p>
		</div>
	</div>
</div>
