<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import {
		zoomLevelMap,
		type GeojsonGeometryType,
		type ILatLngType,
		type IMapLayer
	} from '$lib/features/map/types';
	import { mapLayerStore } from '$lib/features/map/store/layerListStore';
	import { mapStore } from '../store/mapStore';
	import { toggleGoogleMapLayerVisibility } from '../helpers/google/google-map-utils';

	let map: google.maps.Map | undefined;
	mapStore.subscribe((value) => {
		map = value.map;
	});

	const updateMapCenter = (
		coordinates: ILatLngType = { lat: 0, lng: 0 },
		dataType: GeojsonGeometryType = 'Point',
		zoomLevel?: number
	) => {
		if (!map) return;
		map.setCenter(coordinates);
		map.setZoom(zoomLevelMap[dataType] || zoomLevel || 15);
		map.setTilt(50);
	};

	let mapLayers: IMapLayer[];
	mapLayerStore.subscribe((value) => {
		mapLayers = value.mapLayers;
	});

	let filteredLayers: IMapLayer[];
	let search = '';
	let isAllVisible = false;

	const setVisibilityForAllLayers = (visibility: boolean) => {
		const tempLayerList = [...mapLayers];
		tempLayerList.forEach((layer) => {
			layer.isVisible = visibility;
			map = toggleGoogleMapLayerVisibility(map, layer);
		});
		mapLayers = tempLayerList;
		isAllVisible = visibility;
	};

	const toggleLayer = (selectedLayer: IMapLayer) => {
		const tempLayerList = [...mapLayers];
		const index = tempLayerList.findIndex((layer) => layer.layerName === selectedLayer.layerName);
		tempLayerList[index].isVisible = !tempLayerList[index].isVisible;
		map = toggleGoogleMapLayerVisibility(map, tempLayerList[index]);
		isAllVisible = mapLayers.filter((layer) => layer.isVisible).length === mapLayers.length;
		mapLayers = tempLayerList;
	};

	const filterLayersBySearch = () => {
		if (!search || search === '') {
			filteredLayers = mapLayers;
			return;
		}
		filteredLayers = mapLayers.filter((layer) =>
			layer.layerName.toLowerCase().includes(search.toLowerCase())
		);
	};

	$: mapLayers && filterLayersBySearch();
</script>


<div class="flex flex-col p-4 gap-2">
	<div class="flex flex-row gap-2">
		{#if isAllVisible}
			<IconButton
				title={'Hide Layers'}
				icon="fas fa-eye-slash"
				onClickHandle={() => setVisibilityForAllLayers(false)}
				size={'h-10 w-10'}
			/>
		{:else}
			<IconButton
				title={'Show Layers'}
				icon="fas fa-eye"
				onClickHandle={() => setVisibilityForAllLayers(true)}
				size={'h-10 w-10'}
			/>
		{/if}

		<SearchBar onChangeFunction={filterLayersBySearch} bind:search />
	</div>

	{#if filteredLayers.length}
		<div class="flex flex-col max-h-96 overflow-auto gap-2">
			{#each filteredLayers as layer}
				<div class="flex flex-row gap-2">
					<IconButton
						title={'Toggle Layer'}
						icon={layer.icon}
						iconColor={layer.color}
						size={'h-10 w-10'}
						onClickHandle={() => updateMapCenter(layer.initialCoordinates, layer.type)}
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

<div class="mt-auto px-4 py-3 flex flex-row bg-smoke  justify-end">
	<p>Showing {filteredLayers.length} of {mapLayers.length} Layers</p>
</div>
