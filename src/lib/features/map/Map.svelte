<script lang="ts">
	// @ts-ignore
	import type { Map } from 'google.maps';
	import { layerListStore } from './store/layerListStore';
	import { mapStore } from './store/mapStore';
	import type { ILayerListElement } from './types';
	import { INITIAL_MAP_DATA } from './constants/kingston';
	import { onMount } from 'svelte';
	import { getKingstonMapData } from './helpers/geojson/kingston-geojson-util';
	import {
		addLayerElementToLayerList,
		addLayerToGoogleMap,
		toggleGoogleMapLayerVisibility
	} from './helpers/google/google-map-utils';
	import Card from '$lib/layout/Card.svelte';
	import Layers from './components/Layers.svelte';
	import SideBar from './components/SideBar.svelte';

	let layerList: ILayerListElement[];
	layerListStore.subscribe((value) => {
		layerList = value.layerList;
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
		processLayerListElements(tempKingstonLayerList);
	};

	const processLayerListElements = (layerListElements: ILayerListElement[]) => {
		let tempLayerList = layerList;
		for (let i = 0, len = layerListElements.length; i < len; i++) {
			const layerElement = layerListElements[i];
			tempLayerList = addLayerElementToLayerList(tempLayerList, layerElement);
			map = addLayerToGoogleMap(map, layerElement);
			map = toggleGoogleMapLayerVisibility(map, layerElement);
		}
		layerListStore.setLayerList(tempLayerList);
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
		}
	];
	let selectedComponent = components[0];
</script>

<SideBar>
	{#each components as component}
		<button
			class="{selectedComponent.name === component.name
				? 'bg-primary hover:bg-primary-dark'
				: 'bg-dark hover:bg-zinc-800'} text-white flex flex-row gap-2 p-4 w-full"
			on:click={() => (selectedComponent = component)}
		>
			<i class="fa-solid {component.icon}" aria-hidden="true" />
		</button>
	{/each}
</SideBar>

<section class="main relative flex flex-row min-h-screen">
	<div class="absolute top-2 left-2 z-20 w-[24rem] flex flex-col gap-2">
		{#if selectedComponent.name === 'Layers'}
			<Card title="Layers" icon="fa-solid fa-layer-group" showOnLoad={true} disableToggle={true}>
				<Layers />
			</Card>
		{:else if selectedComponent.name === 'Search'}
			<Card title="Search" icon="fa-solid fa-search" showOnLoad={true} disableToggle={true}>
				<p />
			</Card>
		{/if}
	</div>

	<div bind:this={mapDiv} class="min-h-screen w-full" />
</section>
