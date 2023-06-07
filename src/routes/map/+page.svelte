<script lang="ts">
	import {
		zoomLevelMap,
		type ILatLngType,
		type ILayerListElementType,
		type IMapDetailsType
	} from '$lib/types/mapTypes';
	import type {
		IDateTimeDictionaryType,
		IMenuComponentsType,
		ITripsParamType
	} from '$lib/types/types';

	import Card from '$lib/components/Card.svelte';
	import PaginatedTable from '$lib/components/table/PaginatedTable.svelte';

	import LoadingError from '$lib/components/loading/LoadingError.svelte';
	import LoadingSpinner from '$lib/components/loading/LoadingSpinner.svelte';
	import Layers from '$lib/components/map/Layers.svelte';
	import SearchData from '$lib/components/menu/SearchData.svelte';
	import VideoPlayer from '$lib/components/menu/VideoPlayer.svelte';
	import { LINE_STRING } from '$lib/constants/geojson';
	import { getSmarterAiTripWithGps, getSmarterAiTrips } from '$lib/service/smarter-api';
	import type { ITripEventWithSensorDataType } from '$lib/types/eventTypes';
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

	let isLoading = false;
	let isError = false;

	let mapDetails: IMapDetailsType = {
		mapTypeId: 'satellite',
		center: { lng: -76.491143, lat: 44.231689 },
		zoom: 17,
		tilt: 60,
		heading: -17.6
	};

	let layerList: ILayerListElementType[] = [];
	let selectedEvent: ITripEventWithSensorDataType | null = null;
	let selectedPolygon: object | null = null;

	let tripList: ITrip[] = [];

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

	const updateSelectedEvent = (googleMapEvent: ITripEventWithSensorDataType) => {
		console.log(googleMapEvent);
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
			// Check if data exists in local storage
			let localData = localStorage.getItem(JSON.stringify(tripsParams));
			if (localData) {
				let storedData = JSON.parse(localData);

				// Check if data is expired
				const currentTime = new Date().getTime();
				const dataTime = new Date(storedData.timestamp).getTime();
				if (currentTime - dataTime > 30 * 60 * 1000) {
					// 30 minutes in milliseconds
					// Data is expired - remove it from local storage
					localStorage.removeItem(JSON.stringify(tripsParams));
				} else {
					// Data is not expired - use it
					tripList = storedData.tripList;
					processGeojsonData(storedData.tempGeojsonData);
					return;
				}
			}

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
			tripList = tempTripWithGPSList;

			// Save tripList and tempGeojsonData to local storage with a timestamp
			const timestamp = new Date();
			localStorage.setItem(
				JSON.stringify(tripsParams),
				JSON.stringify({ tripList, tempGeojsonData, timestamp })
			);
		} catch (error) {
			console.log(error);
		
		} finally {
			isLoading = false;
		}
	};

	const processGeojsonData = (tempGeojsonData: IGeojsonType[]) => {
		for (let i = 0, len = tempGeojsonData.length; i < len; i++) {
			const gpsElement = tempGeojsonData[i];
			const layerElement = createLayerElement(
				true,
				gpsElement.features[0].properties.endpointName,
				LINE_STRING,
				true,
				'fa-solid fa-car',
				getRandomColor(),
				gpsElement
			);
			layerList = addLayerElementToLayerList(layerList, layerElement);
			map = addLayerToGoogleMap(map, layerElement, updateSelectedEvent);
			map = toggleGoogleMapLayerVisibility(map, layerElement);
		}
	};

	onMount(() => {
		initializeMap();
		getInitialMapData();
	});
</script>

<svelte:head><title>Lynx City Twin</title></svelte:head>

<div>
	<div class="grid grid-cols-1  2xl:grid-cols-12 ">
		<div class="col-span-1 2xl:col-span-2 flex flex-col sm:flex-row 2xl:flex-col p-4 gap-4">
			<Card title="Layers" showOnLoad={true} disableToggle={true}>
				<Layers {layerList} {updateMapCenter} {toggleGoogleLayer} />
			</Card>
			<Card title="Search Data" showOnLoad={true} disableToggle={true}>
				<SearchData {fetchTripsData} />
			</Card>
			<Card title="Video Player" disableToggle={true}>
				<VideoPlayer {selectedEvent} />
			</Card>
		</div>

		<div class={` col-span-1  2xl:col-span-10`}>
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

	{#if tripList.length}
		<div class="p-4">
			<Card title="Trips" width="w-full">
				<PaginatedTable bind:tableData={tripList} {updateMapCenter} />
			</Card>
		</div>
	{/if}
</div>
