<script lang="ts">
	// @ts-ignore
	import type { Map } from 'google.maps';
	import { mapLayerStore } from './store/layerListStore';
	import { mapStore } from './store/mapStore';
	import type { IMapLayer } from './types';
	import { INITIAL_MAP_DATA } from './constants/kingston';
	import { onMount } from 'svelte';
	import { getKingstonMapData } from './helpers/geojson/kingston-geojson-util';
	import {
		addLayerToGoogleMap,
		toggleGoogleMapLayerVisibility
	} from './helpers/google/google-map-utils';
	import Card from '$lib/layout/Card.svelte';
	import Layers from './components/Layers.svelte';
	import SideBar from './components/SideBar.svelte';
	import SelectedMapElement from './components/SelectedMapElement.svelte';
	import SearchData from './components/SearchData.svelte';

	let mapLayers: IMapLayer[];
	mapLayerStore.subscribe((value) => {
		mapLayers = value.mapLayers;
	});

	let mapDiv: HTMLDivElement;
	let map: Map | undefined;
	mapStore.subscribe((value) => {
		map = value.map;
	});

	const initializeMap = () => {
		if (!mapDiv) return;
		map = new google.maps.Map(mapDiv, INITIAL_MAP_DATA);
		mapStore.setMap(map);
	};

	const getInitialMapData = async () => {
		const tempKingstonLayerList = await getKingstonMapData();
		if (!tempKingstonLayerList || !tempKingstonLayerList.length) return;
		processMapLayers(tempKingstonLayerList);
	};
	const processMapLayers = (layerListElements: IMapLayer[]) => {
		let tempMapLayers = mapLayers;

		for (const layerElement of layerListElements) {
			tempMapLayers = [
				...tempMapLayers.filter((item) => item.layerName !== layerElement.layerName),
				layerElement
			];
			map = addLayerToGoogleMap(map, layerElement);
			map = toggleGoogleMapLayerVisibility(map, layerElement);
		}

		mapLayerStore.setMapLayers(tempMapLayers);
	};

	onMount(() => {
		if (!map) {
			initializeMap();
		}
		getInitialMapData();
	});

	const components = [
		{
			name: 'Layers',
			icon: 'fa-solid fa-layer-group'
		},
		{
			name: 'Search',
			icon: 'fa-solid fa-search'
		},
        {
            name: 'Selected Map Element',
            icon: 'fa-solid fa-map-marker'
        }
	];
	let selectedComponent = components[0];
</script>

<SideBar>
	{#each components as component}
		<button
            title={component.name}
			class="{selectedComponent.name === component.name
				? 'bg-primary hover:bg-primary-dark'
				: 'bg-dark hover:bg-zinc-800'} text-white p-2 w-full h-12"
			on:click={() => (selectedComponent = component)}
		>
			<i class="fa-solid {component.icon}" aria-hidden="true" />
		</button>
	{/each}
</SideBar>

<section class="main relative flex flex-row min-h-screen">
	<div class="absolute top-2 left-2 z-20 w-[24rem] flex flex-col gap-2">
		{#if selectedComponent.name === 'Layers'}
			<Card title="Layers" icon="fa-solid fa-layer-group" showOnLoad={true} disableToggle={false}>
				<Layers />
			</Card>
		{:else if selectedComponent.name === 'Search'}
			<Card title="Search" icon="fa-solid fa-search" showOnLoad={true} disableToggle={false}>
				<SearchData />
			</Card>
		{:else if selectedComponent.name === 'Selected Map Element'}
            <Card title="Selected Map Element" icon="fa-solid fa-map-marker" showOnLoad={true} disableToggle={false}>
                <SelectedMapElement />
            </Card>
        {/if}
	</div>

	<div bind:this={mapDiv} class="min-h-screen w-full" />
</section>
