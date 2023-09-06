<script lang="ts">
	import Layers from '$lib/features/map/Layers.svelte';
	import LoadingError from '$lib/features/map/LoadingError.svelte';
	import LoadingSpinner from '$lib/features/map/LoadingSpinner.svelte';
	import { MAP_DATA } from '$lib/features/map/constants/kingston';
	import { convertTripsToLayerListElements } from '$lib/features/map/helpers/geojson/geojson-trips-utils';
	import { getKingstonMapData } from '$lib/features/map/helpers/geojson/kingston-geojson-util';
	import {
		addLayerElementToLayerList,
		addLayerToGoogleMap,
		toggleGoogleMapLayerVisibility
	} from '$lib/features/map/helpers/google/google-map-utils';
	import { layerListStore } from '$lib/features/map/store/layerListStore';
	import { mapStore } from '$lib/features/map/store/mapStore';
	import type {
		ILayerListElement
	} from '$lib/features/map/types';;
	import SearchData from '$lib/features/menu/SearchData.svelte';
	import VideoPlayer from '$lib/features/menu/VideoPlayer.svelte';
	import type { ISearchParamType } from '$lib/features/menu/types/searchParamTypes';
	import Card from '$lib/layout/Card.svelte';
	import mockLayerListElements from '$lib/mock/layerListElements.json';
	import { getGPSForTrips, getSmarterAiTrips } from '$lib/service/smarter-api';
	import type { ITrip } from '$lib/types/smarterAITypes';
	// @ts-ignore
	import type { Map } from 'google.maps';
	import { onMount } from 'svelte';

	let isLoading = false;
	let isError = false;
	let layerList: ILayerListElement[];
	layerListStore.subscribe((value) => {
		layerList = value.layerList;
	});

	let map: Map | undefined;
	mapStore.subscribe((value) => {
		map = value.map;
	});
	let mapDiv: HTMLDivElement;

	const initializeMap = () => {
		if (!mapDiv) return;
		map = new google.maps.Map(mapDiv, MAP_DATA);
		mapStore.setMap(map);
	};

	const getInitialMapData = async () => {
		const tempKingstonLayerList = await getKingstonMapData();
		if (!tempKingstonLayerList || !tempKingstonLayerList.length) return;
		processLayerListElements(tempKingstonLayerList);
	};

	const fetchTripsData = async (searchParams: ISearchParamType) => {
		isLoading = true;
		isError = false;
		try {
			if (searchParams.useRealData) {
				const tempTripList = await getSmarterAiTrips(searchParams);
				if (!tempTripList || !tempTripList.length) return;

				let tempTripWithGPSList: ITrip[] = await getGPSForTrips(tempTripList);
				if (!tempTripWithGPSList || !tempTripWithGPSList.length) return;

				const layerListElements: ILayerListElement[] = await convertTripsToLayerListElements(
					tempTripWithGPSList,
					searchParams.showEvents
				);
				if (!layerListElements || !layerListElements.length) return;
				processLayerListElements(layerListElements);
			} else {
				const layerListElements: ILayerListElement[] =
					mockLayerListElements as ILayerListElement[];
				if (!layerListElements || !layerListElements.length) return;
				processLayerListElements(layerListElements);
			}
		} catch (error) {
			console.error(error);
			isError = true;
		} finally {
			isLoading = false;
		}
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
		if (!map) { initializeMap();}
		getInitialMapData();
	});
</script>

<svelte:head><title>Lynx City Twin</title></svelte:head>

<div class="relative flex flex-row min-h-screen  gap-2">
	<div class="absolute top-2 left-2 z-20 w-[24rem] flex flex-col gap-2">
		
		<Card title="Layers" icon="fa-solid fa-layer-group" showOnLoad={true} disableToggle={false}>
			<Layers />
		</Card>
		<Card title="Search Data" icon="fa-solid fa-search" showOnLoad={true} disableToggle={false}>
			<SearchData {fetchTripsData} />
		</Card>

		<Card
			title="Video Player"
			icon="fa-solid fa-video"
			disableToggle={false}
			showOnLoad={false}
		>
			<VideoPlayer />
		</Card>
	</div>

	<div class="flex-1 flex flex-col h-full relative">
		<div bind:this={mapDiv} class="min-h-screen w-full" />

		{#if isLoading}
			<LoadingSpinner />
		{:else if isError}
			<LoadingError />
		{/if}
	</div>
</div>
