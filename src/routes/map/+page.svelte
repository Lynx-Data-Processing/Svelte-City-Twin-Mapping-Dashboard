<script lang="ts">
	import {
		zoomLevelMap,
		type ILatLngType,
		type ILayerListElementType,
		type IMapDetailsType
	} from '$lib/types/mapTypes';
	import type {
		ITripsParamType
	} from '$lib/types/types';

	import Card from '$lib/components/Card.svelte';

	import Layers from '$lib/components/Layers.svelte';
	import LoadingError from '$lib/components/loading/LoadingError.svelte';
	import LoadingSpinner from '$lib/components/loading/LoadingSpinner.svelte';
	import SearchData from '$lib/components/menu/SearchData.svelte';
	import VideoPlayer from '$lib/components/menu/VideoPlayer.svelte';
	import { LINE_STRING, POINT } from '$lib/constants/geojson';
	import { getSmarterAiTripWithGps, getSmarterAiTrips } from '$lib/service/smarter-api';
	import { TRIP, type IEventGoogleDataType, TRIP_EVENT } from '$lib/types/eventTypes';
	import type { IGeojsonDataType, IGeojsonType } from '$lib/types/geojsonTypes';
	import type { ITrip } from '$lib/types/tripTypes';
	import { getRandomColor } from '$lib/utils/color-utils';
	import { convertTripsToGeoJSON } from '$lib/utils/geojson/geojson-trips-utils';
	import {
		addLayerElementToLayerList,
		addLayerToGoogleMap,
		createLayerElement,
		toggleGoogleMapLayerVisibility
	} from '$lib/utils/geojson/google-map-utils';
	import { getKingstonMapData } from '$lib/utils/geojson/kingston-geojson-util';
	import type { Map } from 'google.maps';
	import { onMount } from 'svelte';
	import About from '$lib/components/menu/About.svelte';

	let isLoading = false;
	let isError = false;

	let mapDetails: IMapDetailsType = {
		mapTypeId: 'roadmap',
		center: { lng: -76.491143, lat: 44.231689 },
		zoom: 17,
		tilt: 60,
		heading: -17.6
	};

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
		for (let i = 0, len = tempKingstonLayerList.length; i < len; i++) {
			layerList = addLayerElementToLayerList(layerList, tempKingstonLayerList[i]);
			map = addLayerToGoogleMap(map, tempKingstonLayerList[i], updateSelectedEvent);
			map = toggleGoogleMapLayerVisibility(map, tempKingstonLayerList[i]);
		}
	};

	const toggleGoogleLayer = (layerElement: ILayerListElementType) => {
		toggleGoogleMapLayerVisibility(map, layerElement);
	};

	const fetchTripsData = async (tripsParams: ITripsParamType) => {
		isLoading = true;
		isError = false;
		try {
			

			const tempTripList = await getSmarterAiTrips(tripsParams);

			if (!tempTripList || !tempTripList.length) return;

			let tempTripWithGPSList: ITrip[] = [];
			for (let i = 0; i < tempTripList.length; i++) {
				const tempTripWithGPS = await getSmarterAiTripWithGps(tempTripList[i].id);
				if (!tempTripWithGPS) continue;
				tempTripWithGPSList.push(tempTripWithGPS);
			}

			const tempGeojsonData: IGeojsonType[] = await convertTripsToGeoJSON(tempTripWithGPSList);
			processGeojsonData(tempGeojsonData);

		} catch (error) {
			console.log(error);
		
		} finally {
			isLoading = false;
		}
	};

	const processGeojsonData = (tempGeojsonData: IGeojsonType[]) => {
		if (!tempGeojsonData || !tempGeojsonData.length) return;
		for (let i = 0, len = tempGeojsonData.length; i < len; i++) {
			const gpsElement = tempGeojsonData[i];
			const layerElement = createLayerElement(
				gpsElement.isTrip ? TRIP : TRIP_EVENT,
				gpsElement.name || 'Trip ' + (i + 1),
				gpsElement.isTrip ? LINE_STRING : POINT,
				true,
				gpsElement.isTrip ? 'fa fa-route' : 'fa fa-map-marker',
				gpsElement.color ?? getRandomColor(),
				gpsElement
			);
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

<div>
	<div class="grid grid-cols-1  2xl:grid-cols-12 ">
		<div class="col-span-1 2xl:col-span-3 flex flex-col  2xl:flex-col p-4 gap-4">
			<Card title="Layers" icon="fa-solid fa-layer-group" showOnLoad={true} disableToggle={false}>
				<Layers bind:layerList {updateMapCenter} {toggleGoogleLayer} />
			</Card>
			<Card title="Search Data" icon="fa-solid fa-search" showOnLoad={true} disableToggle={false}>
				<SearchData {fetchTripsData} />
			</Card>
			<Card title="Video Player" icon="fa-solid fa-video" disableToggle={false}>
				<VideoPlayer {selectedEvent} />
			</Card>

			<Card title="About" icon="fa-solid fa-info-circle" disableToggle={false} showOnLoad={false}>
				<About />
			</Card>
		</div>

		<div class={` col-span-1  2xl:col-span-9`}>
			<div class="relative h-screen scale-in-center">
				<div bind:this={mapDiv} class="h-full w-full " />

				{#if isLoading === true}
					<LoadingSpinner />
				{:else if isError === true}
					<LoadingError />
				{/if}
			</div>
		</div>
	</div>

</div>
