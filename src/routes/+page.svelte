<script lang="ts">
	import type { eventType, selectedPOIType, videoType } from '../types/eventTypes';
	import type { layerListElementType, mapDetailsType } from '../types/mapTypes';
	import type { dateTimeDictionaryType, menuComponentsType } from '../types/types';

	import Card from '../components/Card.svelte';

	import { default as PaginatedTable } from '../components/Events/PaginatedTable.svelte';

	import Layers from '../components/map/Layers.svelte';
	import MapboxMap from '../components/map/MapboxMap.svelte';
	import MapError from '../components/map/MapError.svelte';
	import MapLoadingSpinner from '../components/map/MapLoadingSpinner.svelte';
	import MapStyleSelector from '../components/map/MapStyleSelector.svelte';
	import About from '../components/menu/About.svelte';
	import SearchData from '../components/menu/SearchData.svelte';
	import SelectedVideo from '../components/menu/SelectedVideo.svelte';
	import SelectionMenu from '../components/menu/SelectionMenu.svelte';
	import SpeedView from '../components/menu/SpeedView.svelte';
	import StreetView from '../components/menu/StreetView.svelte';
	import { getAllEvents } from '../service/smarter-api';
	import { rawSmarterAIGPSDataToGeojson } from '../utils/geojson/geojson-utils.js';
	import { getGPSSensorDataFromEventFiles } from '../utils/geojson/gpsData-utils';
	import { findVideo } from '../utils/video-finder';

	//* Set Initial Map Details
	let mapStyle: string = 'mapbox://styles/canaleal/cle0l6bpx004501qotbnxa4wr';
	let mapDetails: mapDetailsType = {
		id: 0,
		center: [-76.491143, 44.231689],
		zoom: 15,
		pitch: 30,
		bearing: -17.6
	};
	//* Polygon and point of interest details
	let layerList: layerListElementType[] = [];
	let selectedPOI: selectedPOIType | null = null;
	let selectedPolygon: object | null = null;

	//* Set Payload details for fetching
	let dateTimeDictionary: dateTimeDictionaryType = {
		startDateTime: '2022-10-23T00:00',
		endDateTime: '2022-12-23T00:00'
	};
	let menuComponents: menuComponentsType[] = [
		{ id: -1, title: 'No Menu', icon: 'fa-times' },
		{ id: 0, title: 'Search Data', icon: 'fa-database' },
		{ id: 1, title: 'Street View', icon: 'fa-road' },
		{ id: 2, title: 'Video Player', icon: 'fa-video' },
		{ id: 3, title: 'About', icon: 'fa-info-circle' }
	];
	let selectedMenu: menuComponentsType = menuComponents[1];
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
		updateMapCenter(gpsData[0].features[0].geometry.coordinates[0]);
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

	function shuffle(array: any) {
		let currentIndex = array.length,
			randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex != 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}

		return array;
	}

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

			let newEventList = rawEventList.reduce(function (
				res: any,
				current: any,
				index: any,
				array: any
			) {
				return res.concat([current]);
			},
			[]);

			newEventList = shuffle(newEventList);

			const tempGpsData = await getMediaEventsFromAllSmarterAIFiles(newEventList);
			await getVideosFromGpsData(tempGpsData);
		} catch (error) {
			alert(error);
			isError = true;
		}

		isLoading = false;
	};
</script>

<SelectionMenu bind:selectedMenu bind:menuComponents />
<main>
	<div class="grid grid-cols-1 md:grid-cols-1  lg:grid-cols-12 ">
		{#if selectedMenu.id != -1}
			<div class="col-span-1 md:col-span-1 lg:col-span-2 flex flex-col gap-4 p-2">
				<Card title="Layers" showOnLoad={true}>
					<Layers bind:layerList {updateMapCenter} />
				</Card>
				{#if selectedMenu.id === 0}
					<Card title="Search Data" showOnLoad={true}>
						<SearchData bind:dateTimeDictionary {fetchEventsData} />
					</Card>
				{:else if selectedMenu.id === 1}
					<Card title="Street View">
						<StreetView bind:selectedPOI />
					</Card>
				{:else if selectedMenu.id === 2}
					<Card title="Video Player">
						<SelectedVideo bind:selectedPOI bind:videoArray />
					</Card>
				{:else if selectedMenu.id === 3}
					<Card title="About">
						<About />
					</Card>
				{/if}
			</div>
		{/if}

		<div
			class={`col-span-1 md:col-span-1 ${
				selectedMenu.id === -1 ? 'lg:col-span-12' : 'lg:col-span-10'
			}  relative`}
		>
			<MapboxMap
				bind:videoArray
				bind:mapDetails
				bind:gpsData
				bind:layerList
				bind:mapStyle
				bind:selectedPOI
			/>

			<!-- <HighResMap /> -->

			{#if isLoading === true}
				<MapLoadingSpinner />
			{:else if isError === true}
				<MapError />
			{/if}

			<div class="absolute top-2 right-2 flex flex-col gap-4 z-100  ">
				<Card title="Map Style" width="w-[15rem]">
					<MapStyleSelector bind:mapStyle />
				</Card>

				<Card title="Speed Legend (Km/h)">
					<SpeedView />
				</Card>
			</div>
		</div>
	</div>
</main>

{#if eventList.length}
	<div class="p-4">
		<Card title="Recordings" width="w-full" disableToggle={true}>
			<PaginatedTable bind:eventList {updateMapCenter} />
		</Card>
	</div>
{/if}
