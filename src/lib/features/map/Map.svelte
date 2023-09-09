<script lang="ts">
	import Card from '$lib/layout/Card.svelte';
	// @ts-ignore
	import type { Map } from 'google.maps';
	import { onMount } from 'svelte';
	import SideBar from '../../layout/SideBar.svelte';
	import ImportGeojson from './components/ImportGeojson.svelte';
	import Layers from './components/Layers.svelte';
	import SearchData from './components/SearchData.svelte';
	import SelectedMapElement from './components/SelectedMapElement.svelte';
	import TableElement from './components/TableElement.svelte';
	import { INITIAL_MAP_DATA } from './constants/kingston';
	import { getKingstonMapData } from './helpers/geojson/kingston-geojson-util';
	import {
		addLayerToGoogleMap,
		toggleGoogleMapLayerVisibility
	} from './helpers/google/google-map-utils';
	import { mapLayerStore } from './store/layerListStore';
	import { mapStore } from './store/mapStore';
	import type { IMapLayer } from './types';


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
		},

		{
			name: 'Table',
			icon: 'fa-solid fa-table'
		},
		{
			name: 'Import Geojson',
			icon: 'fa-solid fa-file-import'
		}
	];
	let selectedComponent = components[0];
</script>

<SideBar>
	{#each components as component}
		<button
			title={component.name}
			class="{selectedComponent.name === component.name
				? 'bg-zinc-800'
				: 'bg-dark hover:bg-zinc-800'} text-white p-2 w-full h-12"
			on:click={() => (selectedComponent = component)}
		>
			<i class="fa-solid {component.icon}" aria-hidden="true" />
		</button>
	{/each}
</SideBar>

<section class="main relative flex flex-row min-h-screen">
	<div class="absolute top-2 left-2 z-[10] flex flex-row gap-2">
		<Card
			width="w-[26rem]"
			extraClasses={selectedComponent.name === 'Layers' ? '' : 'hidden'}
			title="Layers"
			icon="fa-solid fa-layer-group"
			showOnLoad={true}
			disableToggle={true}
			dividerColor="bg-primary"
		>
			<Layers />
		</Card>

		<Card
			width="w-[26rem]"
			extraClasses={selectedComponent.name === 'Search' ? '' : 'hidden'}
			title="Search"
			icon="fa-solid fa-search"
			showOnLoad={true}
			disableToggle={true}
			dividerColor="bg-green-700"
		>
			<SearchData {processMapLayers} />
		</Card>

		<Card
			width="min-w-[26rem] max-w-[40rem]"
			extraClasses={`${selectedComponent.name === 'Selected Map Element' ? '' : 'hidden'} 	resize-x`}
			title="Selected Map Element"
			icon="fa-solid fa-map-marker"
			showOnLoad={true}
			disableToggle={true}
			dividerColor="bg-red-700"
		>
			<SelectedMapElement />
		</Card>


		<Card
			width="min-w-[26rem] max-w-5xl "
			title="Table"
			extraClasses={`${selectedComponent.name === 'Table' ? '' : 'hidden'} resize-x`}
			icon="fa-solid fa-table"
			showOnLoad={true}
			disableToggle={true}
			dividerColor="bg-purple-700"
		>
			<TableElement />
		</Card>

		<Card
			width="w-[26rem]"
			title="Import Geojson"
			icon="fa-solid fa-file-import"
			extraClasses={`${selectedComponent.name === 'Import Geojson' ? '' : 'hidden'} `}
			showOnLoad={true}
			disableToggle={true}
			dividerColor="bg-orange-700"
		>
			<ImportGeojson {processMapLayers} />
		</Card>

		

	</div>

	<div bind:this={mapDiv} class="min-h-screen w-full" />
</section>
