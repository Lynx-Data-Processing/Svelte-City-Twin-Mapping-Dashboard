<script lang="ts">
	import type {
		layerLisElementType,
		dateTimeDictionaryType,
		mapDetailsType,
		selectedEventType,
		videoType,
		selectedPOIType,
		eventType,
		menuComponentsType
	} from '../types/types';

	import { GeojsonEnum } from '../types/enums';

	import Map from '../components/map/Map.svelte';
	import DateTime from '../components/menu/SearchDateTime.svelte';
	import Layers from '../components/map/Layers.svelte';
	import MapStyleSelector from '../components/map/MapStyleSelector.svelte';
	import StreetView from '../components/menu/StreetView.svelte';
	import { findVideo } from '../utils/popup/video-finder';
	import {
		rawSmarterAIGPSDataToGeojson,
		rawGPSDataToGeojsonData
	} from '../utils/geojson/geojson-utils.js';
	import { getGPSSensorDataFromEventFiles } from '../utils/geojson/gpsData-utils';
	import { getAllEvents } from '../service/smarter-api';
	import MapLoadingSpinner from '../components/map/MapLoadingSpinner.svelte';
	import MapError from '../components/map/MapError.svelte';
	import RecordingsTable from '../components/RecordingsTable.svelte';
	import SelectedVideo from '../components/menu/SelectedVideo.svelte';
	import AddGeojson from '../components/menu/AddGeojson.svelte';
	import SelectionMenu from '../components/menu/SelectionMenu.svelte';
	import SpeedView from '../components/menu/SpeedView.svelte';
	
	//* Set Initial Map Details
	let mapStyle: string = 'outdoors-v11';
	let mapDetails: mapDetailsType = {
		id: 0,
		center: [-76.491143, 44.231689],
		zoom: 12,
		pitch: 0,
		bearing: -17.6
	};
	//* Polygon and point of interest details
	let layerList: layerLisElementType[] = [];
	let selectedEvent: selectedEventType | null = null;
	let selectedPOI: selectedPOIType | null = null;
	let selectedPolygon: object | null = null;

	//* Set Payload details for fetching
	let dateTimeDictionary: dateTimeDictionaryType = {
		startDateTime: '2022-10-23T00:00',
		endDateTime: '2022-12-23T00:00'
	};
	let menuComponents: menuComponentsType[] = [
		{ id: 0, title: 'Search Data', icon: 'fa-database' },
		{ id: 1, title: 'Street View', icon: 'fa-road' },
		{ id: 2, title: 'Video Player', icon: 'fa-video' },
		{ id: 3, title: 'Add Geojson', icon: 'fa-map' }
	];
	let selectedMenu: menuComponentsType = menuComponents[0];
	let isLoading = false;
	let isError = false;
	let gpsData: any[] = [];


	let videoArray: videoType[] = [];
	let eventList: eventType[] = [];



	

	const updateMapCenter = (coordinates: number[]) => {
		mapDetails = {
			id: 0,
			center: coordinates,
			zoom: 15,
			pitch: 0,
			bearing: -17.6
		};
	};

	

	/**
	 * Retrieves GPS sensor data and video URLs from a list of events and updates the `eventList`, `gpsData`, and `videoArray` arrays.
	 * @param rawEventList The list of raw events.
	 */
	const getMediaEventsFromAllSmarterAIFiles = async (rawEventList: eventType[]) => {
		const [tempGPSList, tempEventList] = await getGPSSensorDataFromEventFiles(rawEventList);
		eventList = tempEventList;

		if (!tempGPSList.length) return;

		//* If data exists, create the GPS Geojson layer
		const tempGeojsonData = rawSmarterAIGPSDataToGeojson(tempGPSList);
		if (!tempGeojsonData) return;
		gpsData = tempGeojsonData;
		updateMapCenter(gpsData[0].features[0].geometry.coordinates);
		return gpsData;
	};

	/**
	 * Retrieves video URLs for each GPS element in the given GeoJSON data and updates the `videoArray` array.
	 * @param gpsData The GeoJSON data containing GPS elements.
	 */
	const getVideosFromGpsData = async (gpsData: any) => {
		let tempVideoArray: videoType[] = [];
		for (const geojson of gpsData) {
			for (const gpsElement of geojson.features) {
				try {
					const videoLink: string = await findVideo(
						gpsElement.properties.StartTime,
						gpsElement.properties.EndTime,
						gpsElement.properties.EndpointId
					);
					const video: videoType = {
						eventId: gpsElement.properties.EventId,
						deviceId: gpsElement.properties.DeviceId,
						endpointId: gpsElement.properties.EndpointId,
						startTimestamp: gpsElement.properties.StartTime,
						endTimestamp: gpsElement.properties.EndTime,
						videoUrl: videoLink
					};

					tempVideoArray.push(video);
				} catch (error) {
					console.error(`Error retrieving video URL: ${error}`);
				}
			}
		}
		videoArray = tempVideoArray;
	};

	/**
	 * Fetches event data and calls `getMediaEventsFromAllSmarterAIFiles()` to process the data.
	 */
	const fetchEventsData = async () => {
		isLoading = true;
		isError = false;

		try {
			const response = await getAllEvents(
				dateTimeDictionary.startDateTime,
				dateTimeDictionary.endDateTime
			);

			if (!response || response.status !== 200 || !response.data) {
				alert('No GPS Events found');
				return;
			}

			const rawEventList = response.data.eventList;
			const tempGpsData = await getMediaEventsFromAllSmarterAIFiles(rawEventList);
			await getVideosFromGpsData(tempGpsData);
		} catch (error) {
			alert(error);
			isError = true;
		}

		isLoading = false;
	};

	/**
	 * Adds GeoJSON data to the `gpsData` array and updates the map center.
	 * @param input The input data in the form of an object.
	 * @param name The name of the data.
	 * @param dataType The type of data, either 'Point' or 'Polygon'.
	 * @param color The color of the data.
	 */
	const addGeojsonData = (
		input: object,
		name = 'Own Data',
		dataType = GeojsonEnum.Point,
		color = 'Red'
	) => {
		try {
			gpsData = [rawGPSDataToGeojsonData(input, name, dataType, color)];
		} catch (error) {
			console.error(`Error converting input data to GeoJSON: ${error}`);
			return;
		}

		try {
			const coordinates =
				dataType === 'Point'
					? gpsData[0].features[0].geometry.coordinates
					: gpsData[0].features[0].geometry.coordinates[0][0];
			updateMapCenter(coordinates);
		} catch (error) {
			console.error(`Error updating map center: ${error}`);
		}
	};
</script>

<SelectionMenu bind:selectedMenu bind:menuComponents />
<main class="grid grid-cols-1 gap-4 lg:grid-cols-12 ">
	<div class={`col-span-1 lg:col-span-12 relative`}>
		<Map
			bind:videoArray
			{mapDetails}
			bind:gpsData
			bind:layerList
			bind:mapStyle
			bind:selectedPOI
			bind:selectedEvent
			bind:selectedMenu
		/>

		{#if isLoading === true}
			<MapLoadingSpinner />
		{:else if isError === true}
			<MapError />
		{/if}

		<div class="absolute top-2 left-2 flex flex-row gap-4 z-100">
			<div class={`flex flex-col gap-4`}>
				<Layers bind:layerList />
				{#if selectedMenu.id === 0}
					<DateTime bind:dateTimeDictionary {fetchEventsData} />
				{:else if selectedMenu.id === 1}
					<StreetView bind:selectedPOI />
				{:else if selectedMenu.id === 2}
					<SelectedVideo bind:selectedEvent bind:videoArray />
				{:else if selectedMenu.id === 3}
					<AddGeojson {addGeojsonData} />
				{/if}
			</div>
			
		</div>

		<div class="absolute top-16 right-2 flex flex-row gap-4 z-100">

			<div class={`flex flex-col gap-4`}>

			<div class="h-fit">
				<MapStyleSelector bind:mapStyle />
			</div>

			<div class="h-fit">
				<SpeedView  bind:gpsData/>
			</div>

			</div>
		</div>

	</div>
</main>

{#if eventList.length}
	<RecordingsTable bind:eventList />
{/if}
