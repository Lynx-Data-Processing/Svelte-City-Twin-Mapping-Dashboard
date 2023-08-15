<script lang="ts">
	import LoadingError from '$lib/components/loading/LoadingError.svelte';
	import LoadingSpinner from '$lib/components/loading/LoadingSpinner.svelte';
	import Layers from '$lib/components/menu/Layers.svelte';
	import SearchData from '$lib/components/menu/SearchData.svelte';
	import VideoPlayer from '$lib/components/menu/VideoPlayer.svelte';
	import { POINT } from '$lib/constants';
	import { MAP_DATA } from '$lib/constants/initialData';
	import mockLayerListElements from '$lib/mock/layerListElements.json';
	import { getGPSForTrips, getSmarterAiTrips } from '$lib/service/smarter-api';
	import {
		zoomLevelMap,
		type ILatLngType,
		type ILayerListElementType,
		type IMapDetailsType
	} from '$lib/types/mapTypes';
	import type { ISearchParamType } from '$lib/types/types';

	import Card from '$lib/components/Card.svelte';
	import type { IGeojsonDataType } from '$lib/types/geojsonTypes';
	import type { IEventGoogleDataType } from '$lib/types/googleTypes';
	import type { ITrip } from '$lib/types/tripTypes';
	import { convertTripsToLayerListElements } from '$lib/utils/geojson/geojson-trips-utils';
	import { getKingstonMapData } from '$lib/utils/geojson/kingston-geojson-util';
	import {
		addLayerElementToLayerList,
		addLayerToGoogleMap,
		toggleGoogleMapLayerVisibility
	} from '$lib/utils/google/google-map-utils';
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
		dataType: IGeojsonDataType = POINT,
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
		if (!map) {initializeMap();};
		getInitialMapData();
	});
</script>

<svelte:head><title>Lynx City Twin</title></svelte:head>

<div class="relative h-screen overflow-hidden">
	<div bind:this={mapDiv} class="h-full max-h-screen" />

	<div class="absolute top-2 left-2 flex flex-col  2xl:flex-col p-4 gap-4 w-[26rem]">
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

	{#if isLoading}
		<LoadingSpinner />
	{:else if isError}
		<LoadingError />
	{/if}
</div>
