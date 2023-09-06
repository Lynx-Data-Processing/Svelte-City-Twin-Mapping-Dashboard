<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import {
		zoomLevelMap,
		type IGeojsonDataType,
		type ILatLngType,
		type ILayerListElement
	} from '$lib/features/map/types';
	import { layerListStore } from '$lib/features/map/store/layerListStore';
	import { mapStore } from '../store/mapStore';
	import { toggleGoogleMapLayerVisibility } from '../helpers/google/google-map-utils';

	let map: google.maps.Map | undefined;
	mapStore.subscribe((value) => {
		map = value.map;
	});

	const updateMapCenter = (
		coordinates: ILatLngType,
		dataType: IGeojsonDataType = 'Point',
		zoomLevel?: number
	) => {
		if (!map) return;
		map.setCenter(coordinates);
		map.setZoom(zoomLevelMap[dataType] || zoomLevel || 15);
		map.setTilt(50);
	};

	const toggleGoogleLayer = (layerElement: ILayerListElement) => {
		if (!map) return;
		map = toggleGoogleMapLayerVisibility(map, layerElement);
	};

	let layerList: ILayerListElement[];
	layerListStore.subscribe((value) => {
		layerList = value.layerList;
	});

	let filteredLayers: ILayerListElement[];
	let search = '';
	let isAllVisible = false;



	const hideAllLayers = () => {
		const tempLayerList = layerList;
		tempLayerList.forEach((layer) => {
			layer.isVisible = false;
		});

		layerList = tempLayerList;
		layerList.forEach((layer) => {
			toggleGoogleLayer(layer);
		});

		isAllVisible = false;
	};

	const showAllLayers = () => {
		const tempLayerList = layerList;
		tempLayerList.forEach((layer) => {
			layer.isVisible = true;
		});

		layerList = tempLayerList;
		layerList.forEach((layer) => {
			toggleGoogleLayer(layer);
		});

		isAllVisible = true;
	};

	const checkIfAllVisible = () => {
		const visibleLayers = layerList.filter((layer) => layer.isVisible);
		isAllVisible = visibleLayers.length === layerList.length;
	};

	const toggleLayer = (selectedLayer: ILayerListElement) => {
		const index = layerList.findIndex((layer) => layer.layerName === selectedLayer.layerName);
		layerList[index].isVisible = !layerList[index].isVisible;
		toggleGoogleLayer(layerList[index]);

		if (layerList[index].isVisible)
			updateMapCenter(selectedLayer.initialCoordinates!, selectedLayer.type);

		checkIfAllVisible();
	};

	const filterLayersBySearch = () => {
		if (!search || search === '') {
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
				onClickHandle={hideAllLayers}
				size={'h-10 w-10'}
			/>
		{:else}
			<IconButton
				title={'Show Layers'}
				icon="fas fa-eye"
				onClickHandle={showAllLayers}
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
