<script lang="ts">
	import {
		zoomLevelMap,
		type ILatLngType,
		type ILayerListElementType,
		type IMapDetailsType
	} from '$lib/types/mapTypes';
	import type { ISearchParamType } from '$lib/types/types';

	import Card from '$lib/components/Card.svelte';

	import Layers from '$lib/components/Layers.svelte';
	import LoadingError from '$lib/components/loading/LoadingError.svelte';
	import LoadingSpinner from '$lib/components/loading/LoadingSpinner.svelte';
	import Filters from '$lib/components/menu/Filters.svelte';
	import SearchData from '$lib/components/menu/SearchData.svelte';
	import VideoPlayer from '$lib/components/menu/VideoPlayer.svelte';
	import { POINT } from '$lib/constants';
	import { MAP_DATA } from '$lib/constants/initialData';
	import mockLayerListElements from '$lib/mock/layerListElements.json';
	import { getGPSForTrips, getSmarterAiTrips } from '$lib/service/smarter-api';
	import type { IEventGoogleDataType } from '$lib/types/eventTypes';
	import type { IGeojsonDataType } from '$lib/types/geojsonTypes';
	import type { ITrip } from '$lib/types/tripTypes';
	import { javascriptObjectToJSONFile } from '$lib/utils/download-utils';
	import { convertTripsToLayerListElements } from '$lib/utils/geojson/geojson-trips-utils';
	import {
		addLayerElementToLayerList,
		addLayerToGoogleMap,
		toggleGoogleMapLayerVisibility
	} from '$lib/utils/geojson/google-map-utils';
	import { getKingstonMapData } from '$lib/utils/geojson/kingston-geojson-util';
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
				let layerListElementsTrips = layerListElements.filter((layerListElement) =>
					layerListElement.layerName.includes('Trips')
				);
				javascriptObjectToJSONFile(layerListElementsTrips, 'layerListElementsTrips.json');

				let layerListElementsEvents = layerListElements.filter((layerListElement) =>
					layerListElement.layerName.includes('Events')
				);
				javascriptObjectToJSONFile(layerListElementsEvents, 'layerListElementsEvents.json');

				processLayerListElements(layerListElements);
			} else {
				const layerListElements: ILayerListElementType[] = mockLayerListElements.slice(
					0,
					25
				) as ILayerListElementType[];
				if (!layerListElements || !layerListElements.length) return;
				processLayerListElements(layerListElements);
			}
		} catch (error) {
			console.log(error);
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
		initializeMap();
		if (!map) return;
		getInitialMapData();
	});
</script>

<svelte:head><title>Lynx City Twin</title></svelte:head>

<div class="grid grid-cols-1  2xl:grid-cols-12 ">
	<div class="col-span-1 2xl:col-span-3 flex flex-col  2xl:flex-col p-4 gap-4">
		<Card title="Layers" icon="fa-solid fa-layer-group" showOnLoad={true} disableToggle={true}>
			<Layers bind:layerList {updateMapCenter} {toggleGoogleLayer} />
		</Card>

		<Card title="Filters" icon="fa-solid fa-filter" showOnLoad={true} disableToggle={true}>
			<Filters />
		</Card>

		<Card title="Search Data" icon="fa-solid fa-search" showOnLoad={true} disableToggle={false}>
			<SearchData {fetchTripsData} />
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

	<div class={` col-span-1 map 2xl:col-span-9`}>
		<div class="relative h-full scale-in-center">
			<div bind:this={mapDiv} class="h-full w-full " />

			{#if isLoading}
				<LoadingSpinner />
			{:else if isError}
				<LoadingError />
			{/if}
		</div>
	</div>
</div>
