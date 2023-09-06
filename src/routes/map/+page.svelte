<script lang="ts">
	import { MAP_DATA } from '$lib/constants';
	import Layers from '$lib/features/map/Layers.svelte';
	import LoadingError from '$lib/features/map/LoadingError.svelte';
	import LoadingSpinner from '$lib/features/map/LoadingSpinner.svelte';
	import { convertTripsToLayerListElements } from '$lib/features/map/helpers/geojson/geojson-trips-utils';
	import { getKingstonMapData } from '$lib/features/map/helpers/geojson/kingston-geojson-util';
	import {
		addLayerElementToLayerList,
		addLayerToGoogleMap,
		toggleGoogleMapLayerVisibility
	} from '$lib/features/map/helpers/google/google-map-utils';
	import { zoomLevelMap, type IEventGoogleDataType, type IGeojsonDataType, type ILatLngType, type ILayerListElementType, type IMapDetailsType } from '$lib/features/map/types';
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

	let mapDetails: IMapDetailsType = MAP_DATA;
	let layerList: ILayerListElementType[] = [];
	let selectedEvent: IEventGoogleDataType | null = null;

	let map: Map | undefined;
	let mapDiv: HTMLDivElement;

	const initializeMap = () => {
		if (!mapDiv) return;
		map = new google.maps.Map(mapDiv, mapDetails);
	};

	const updateMapCenter = (
		coordinates: ILatLngType,
		dataType: IGeojsonDataType = 'Point',
		zoomLevel?: number
	) => {
		map.setCenter(coordinates);
		map.setZoom(zoomLevelMap[dataType] || zoomLevel || 15);
		map.setTilt(50);
	};

	const updateSelectedEvent = (googleMapEvent: IEventGoogleDataType) => {
		selectedEvent = googleMapEvent;
	};

	const getInitialMapData = async () => {
		const tempKingstonLayerList = await getKingstonMapData();
		if (!tempKingstonLayerList || !tempKingstonLayerList.length) return;
		processLayerListElements(tempKingstonLayerList);
	};

	const toggleGoogleLayer = (layerElement: ILayerListElementType) => {
		toggleGoogleMapLayerVisibility(map, layerElement);
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

				const layerListElements: ILayerListElementType[] = await convertTripsToLayerListElements(
					tempTripWithGPSList,
					searchParams.showEvents
				);
				if (!layerListElements || !layerListElements.length) return;
				processLayerListElements(layerListElements);
			} else {
				const layerListElements: ILayerListElementType[] =
					mockLayerListElements as ILayerListElementType[];
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

	const processLayerListElements = (layerListElements: ILayerListElementType[]) => {
		for (let i = 0, len = layerListElements.length; i < len; i++) {
			const layerElement = layerListElements[i];
			layerList = addLayerElementToLayerList(layerList, layerElement);
			map = addLayerToGoogleMap(map, layerElement, updateSelectedEvent);
			map = toggleGoogleMapLayerVisibility(map, layerElement);
		}
	};

	onMount(() => {
		if (!map) {
			initializeMap();
		}
		getInitialMapData();
	});
</script>

<svelte:head><title>Lynx City Twin</title></svelte:head>

<div class="relative flex flex-row min-h-screen   gap-2">
	<div class="w-[30rem] flex flex-col gap-2 p-4 ">
		<Card title="Search Data" icon="fa-solid fa-search" showOnLoad={true} disableToggle={false}>
			<SearchData {fetchTripsData} />
		</Card>

		<Card title="Layers" icon="fa-solid fa-layer-group" showOnLoad={true} disableToggle={true}>
			<Layers bind:layerList {updateMapCenter} {toggleGoogleLayer} />
		</Card>

		<Card
			title="Video Player"
			icon="fa-solid fa-video"
			disableToggle={false}
			showContent={selectedEvent ? true : false}
		>
			<VideoPlayer {selectedEvent} />
		</Card>
	</div>

	<div class="flex-1 flex flex-col h-full relative">
	
			<div bind:this={mapDiv} class="min-h-screen w-full " />

			{#if isLoading}
				<LoadingSpinner />
			{:else if isError}
				<LoadingError />
			{/if}
		
	</div>
</div>
