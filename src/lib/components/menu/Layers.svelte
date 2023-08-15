<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import type { ILayerListElementType } from '$lib/types/mapTypes';
	import { isEmptyString } from '$lib/utils/is-emptyString';

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

	let isModalOpen = false;
	const openModal = (layer: ILayerListElementType) => {
		selectedLayer = layer;
		isModalOpen = true;
	};

	const closeModal = () => {
		selectedLayer = null;
		isModalOpen = false;
	};
</script>

{#if selectedLayer && selectedLayer.geojson}
	<Modal {closeModal} title={'Table'} icon={'fa-solid fa-filter'}/>
{/if}

<div class="flex flex-col p-4 gap-2">
	<div class="flex flex-row gap-2">
		{#if isAllVisible}
			<button title="Hide All Layers" class="btn btn-icon" on:click={toggleAllLayers}>
				<i class="fas fa-eye-slash m-auto" />
			</button>
		{:else}
			<button title="Show All Layers" class="btn btn-icon" on:click={toggleAllLayers}>
				<i class="fas fa-eye m-auto" />
			</button>
		{/if}

		<SearchBar onChangeFunction={filterLayersBySearch} bind:search />
	</div>

	{#if filteredLayers.length}
		<div class="flex flex-col max-h-96 overflow-auto gap-2 py-2 ">
			{#each filteredLayers as layer}
				<div class="flex flex-row gap-2 h-full">
					<button class="btn btn-icon" on:click={() => openModal(layer)}>
						<i class={`${layer.icon} m-auto`} style="color: {layer.color}" />
					</button>

					<button
						title={layer.layerName}
						on:click={() => {
							toggleLayer(layer);
						}}
						class={`btn w-full ${layer.isVisible ? 'btn-selected' : 'btn-black-outline'} `}
					>
						<div class="flex flex-row justify-between gap-4">
							<p>{layer.layerName}</p>
						</div>
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<div class="mt-auto p-4 flex flex-row bg-smoke  justify-end">
	<p>Showing {filteredLayers.length} of {layerList.length} Layers</p>
</div>
