<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { mapLayerStore } from '$lib/features/map/store/layerListStore';
	import { toggleGoogleMapLayerVisibility } from '../helpers/google/google-map-utils';
	import { mapStore } from '../store/mapStore';
	import type { IMapLayer } from '../types';
	import LayerToggle from './layers/LayerToggle.svelte';
	import UpdateCenterButton from './layers/UpdateCenterButton.svelte';

	let map: google.maps.Map;
	mapStore.subscribe((value) => {
		map = value.map;
	});

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

	let selectedLayer: IMapLayer | null = null;
	let isLayerMenuOpen: boolean = false;

	const handleToggleLayerMenu = (layer: IMapLayer) => {
		if (layer.layerName !== selectedLayer?.layerName) {
			selectedLayer = layer;
			isLayerMenuOpen = true;
		} else {
			selectedLayer = isLayerMenuOpen ? null : layer;
			isLayerMenuOpen = !isLayerMenuOpen;
		}
	};
</script>

<div class="flex flex-col p-4 gap-2">
	<div class="flex flex-row gap-2">
		<IconButton
			title={isAllVisible ? 'Hide All Layers' : 'Show All Layers'}
			icon={isAllVisible ? 'fas fa-eye ' : 'fas fa-eye-slash'}
			onClickHandle={() => setVisibilityForAllLayers(!isAllVisible)}
			size="h-10 w-10"
		/>
		<SearchBar onChangeFunction={filterLayersBySearch} bind:search />
	</div>

	{#if filteredLayers.length}
		<div class="flex flex-col max-h-96 overflow-auto gap-2">
			{#each filteredLayers as layer}
				<div class="overflow-hidden border-[1px] rounded-md h-fit w-full bg-white ">
					<LayerToggle {layer} {toggleLayer} {handleToggleLayerMenu} />

					{#if isLayerMenuOpen && selectedLayer?.layerName === layer.layerName}
						<UpdateCenterButton {layer} {map} />

					
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<div class="mt-auto px-4 py-4 flex flex-row bg-smoke  justify-end">
	<p>Showing {filteredLayers.length} of {mapLayers.length} Layers</p>
</div>
