<script>
	// @ts-nocheck

	import Map from '../components/map/Map.svelte';
	import SearchDetails from '../components/menu/SearchDetails.svelte';
	import DateTime from '../components/menu/DateTime.svelte';
	import Layers from '../components/map/Layers.svelte';
	import MapStyleSelector from '../components/map/MapStyleSelector.svelte';
	import Filters from '../components/menu/Filters.svelte';
	import StreetView from '../components/menu/StreetView.svelte';
	import { findVideo } from '../utils/popup/video-finder';
	import Navbar from '../components/Navbar.svelte';
	import { rawSmarterAIGPSDataToGeojson } from '../utils/geojson/geojson-utils.js';
	import {
		getListOfDevicesUnderTenant,
		getAllEvents,
		getGeojsonDataFromFile
	} from '../service/smarter-api';
	import MapLoadingSpinner from '../components/map/MapLoadingSpinner.svelte';
	import MapError from '../components/map/MapError.svelte';
	import RecordingsTable from '../components/RecordingsTable.svelte';
	import SelectedVideo from '../components/menu/SelectedVideo.svelte'
	//* Set Initial Map Details
	let isReadyForStyleSwitching = false;
	let mapStyle = 'outdoors-v11';
	let mapDetails = {
		id: 0,
		center: [-76.5, 44.233334],
		zoom: 11,
		pitch: 0,
		bearing: -17.6
	};
	//* Polygon and point of interest details
	let layerList = [];
	let selectedEvent = null;
	let selectedPolygon = null;

	//* Set Payload details for fetching
	let dateTimeDictionary = {
		startDateTime: '2015-06-23T00:00',
		endDateTime: '2022-12-23T00:00'
	};
	let menuComponents = [
		{ id: 0, title: 'Search Data', icon: 'fa-database' },
		{ id: 1, title: 'Street View', icon: 'fa-road' },
		{ id: 2, title: 'Filter View', icon: 'fa-filter' },
		{ id: 3, title: 'Video Player', icon: 'fa-video' }
	];
	let selectedMenu = menuComponents[0].id;
	let isLoading = true;
	let isError = false;
	let gpsData = [];
	let gpsFilters = [
		{
			id: 'Speed',
			name: 'Speed Filter',
			default: [0, 100],
			step: 10,
			suffix: 'Km/h',
			selected: [0, 300]
		}
	];
	let devicesArray = [];
	const fetchSmarterAIDevices = async () => {
		const response = await getListOfDevicesUnderTenant();
		if (response.status === 200) {
			if (response.data.endpoints.length > 0) {
				devicesArray = response.data.endpoints;
			} else {
				alert('Not able to fetch devices from Smarter AI');
			}
		} else {
			alert(response);
		}
	};
	fetchSmarterAIDevices();

	let videoLinks = [];
	const getGPSDataFromAllSmarterAIFiles = async (events) => {
		//* Preapre the GPS Array
		let tempGPSList = [];
		for (let index = 0; index < events.length; index++) {
			const event = events[index];
			const sensorDonloadUrl = event.snapshots[2].downloadUrl;
			const response = await getGeojsonDataFromFile(sensorDonloadUrl);
			try {
				if (response.status === 200) {
					if (response.data) {
						let gpsRawData = response.data;
						gpsRawData['id'] = event.id;
						gpsRawData['deviceId'] = event.deviceId;
						gpsRawData['endpointId'] = event.endpointId;
						gpsRawData['recordingStartTimestamp'] = event.recordingStartTimestamp;
						gpsRawData['recordingEndTimestamp'] = event.recordingEndTimestamp;
						tempGPSList.push(gpsRawData);
					} else {
						console.log('Not able to fetch devices from Smarter AI');
					}
				} else {
					console.error('Unable load File GPS Data');
				}
			} catch (err) {
				console.error(err);
			}
		}

		//* If data exists, create the GPS Geojson layer
		if (tempGPSList.length) {
			gpsData = rawSmarterAIGPSDataToGeojson(tempGPSList);
			mapDetails = {
				id: 0,
				center: gpsData[0].features[0].geometry.coordinates,
				zoom: 15,
				pitch: 0,
				bearing: -17.6
			};

			// for (const geojson of gpsData) {
			// 	// You can use `let` instead of `const` if you like

			// 	for (const gpsElement of geojson.features) {
			// 		const videoLink = await findVideo(
			// 			gpsElement.properties.StartTime,
			// 			gpsElement.properties.EndTime,
			// 			gpsElement.properties.EndpointId
			// 		);
			// 		const video = {
			// 			eventId: gpsElement.properties.EventId,
			// 			deviceId: gpsElement.properties.DeviceId,
			// 			endpointId: gpsElement.properties.EndpointId,
			// 			startTimestamp: gpsElement.properties.StartTime,
			// 			endTimestamp: gpsElement.properties.EndTime,
			// 			videoUrl: videoLink
			// 		};

			// 		videoLinks.push(video);
			// 	}
			// }
		}

		console.log(videoLinks);
	};



	let eventList = [];
	const fetchEventsData = async () => {
		isLoading = true;
		isError = false;
		const response = await getAllEvents(
			dateTimeDictionary.startDateTime,
			dateTimeDictionary.endDateTime
		);
		if (response && response.status === 200) {
			if (response.data) {
				eventList = response.data.eventList;

				await getGPSDataFromAllSmarterAIFiles(eventList);
			} else {
				alert('No GPS Events found');
			}
		} else {
			alert(response);
			isError = true;
		}
		isLoading = false;
	};


</script>

<div class="flex flex-col">
	<Navbar title={'City Twin Mapping Dashboard'} bind:selectedMenu bind:menuComponents />
	<main class="flex-1 grid grid-cols-1 gap-4 lg:grid-cols-12 ">
		<div class={`col-span-1 lg:col-span-12 relative`}>
			<Map
				bind:videoLinks
				bind:isLoading
				{mapDetails}
				bind:gpsFilters
				bind:gpsData
				bind:layerList
				bind:mapStyle
				bind:isReadyForStyleSwitching
				bind:selectedPolygon
				bind:selectedEvent
				bind:selectedMenu
			/>

			<div class="absolute top-2 left-2 flex flex-row gap-4 z-100">
				<div class={`flex flex-col gap-4`}>
					<Layers bind:layerList />
					{#if selectedMenu === 0}
						<DateTime bind:dateTimeDictionary />
						<SearchDetails bind:dateTimeDictionary bind:selectedPolygon {fetchEventsData} />
					{:else if selectedMenu === 1}
						<StreetView bind:selectedEvent />
					{:else if selectedMenu === 2}
						<Filters bind:gpsFilters bind:gpsData />
					{:else if selectedMenu === 3}
						<SelectedVideo bind:selectedEvent bind:videoLinks />
					{/if}
				</div>
				<div>
					<MapStyleSelector bind:mapStyle bind:isReadyForStyleSwitching />
				</div>
			</div>

			{#if isLoading === true}
				<MapLoadingSpinner />
			{:else if isError === true}
				<MapError />
			{/if}
		</div>
	</main>
</div>

{#if eventList.length}
	<section class="grid grid-cols-1 gap-4 lg:grid-cols-12 my-8 px-4">
		<div class="col-span-1 md:col-span-12">
			<RecordingsTable bind:eventList />
		</div>
	</section>
{/if}
