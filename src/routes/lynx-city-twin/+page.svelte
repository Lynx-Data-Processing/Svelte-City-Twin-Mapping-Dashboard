<script lang="ts">
	import type { eventType, selectedPOIType, videoType } from '../../types/eventTypes';
	import type { layerListElementType, mapDetailsType } from '../../types/mapTypes';
	import type { dateTimeDictionaryType, menuComponentsType } from '../../types/types';

	import Card from '../../components/Card.svelte';

	import { default as PaginatedTable } from '../../components/Events/PaginatedTable.svelte';

	import Layers from '../../components/map/Layers.svelte';
	import MapboxMap from '../../components/map/MapboxMap.svelte';
	import MapError from '../../components/map/MapError.svelte';
	import MapLoadingSpinner from '../../components/map/MapLoadingSpinner.svelte';
	import MapStyleSelector from '../../components/map/MapStyleSelector.svelte';
	import About from '../../components/menu/About.svelte';
	import SearchData from '../../components/menu/SearchData.svelte';
	import SelectedVideo from '../../components/menu/SelectedVideo.svelte';
	import SelectionMenu from '../../components/menu/SelectionMenu.svelte';
	import SpeedView from '../../components/menu/SpeedView.svelte';
	import StreetView from '../../components/menu/StreetView.svelte';
	import { callAndProcessAPI, getAllEvents, getVideosFromGpsData } from '../../service/smarter-api';
	import { rawSmarterAIGPSDataToGeojson } from '../../utils/geojson/geojson-utils.js';
	import { getGPSSensorDataFromEventFiles } from '../../utils/geojson/gpsData-utils';

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
		{ id: 0, title: 'No Menu', icon: 'fa-times' },
		{ id: 1, title: 'Search Data', icon: 'fa-database' },
		{ id: 2, title: 'Street View', icon: 'fa-road' },
		{ id: 3, title: 'Video Player', icon: 'fa-video' },
		{ id: 4, title: 'About', icon: 'fa-info-circle' }
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
	 * Fetches event data and calls `getMediaEventsFromAllSmarterAIFiles()` to process the data.
	 */
	const fetchEventsData = async () => {
		isLoading = true;
		isError = false;

		try {
			// const response = await getAllEvents(
			// 	dateTimeDictionary.startDateTime,
			// 	dateTimeDictionary.endDateTime
			// );

			// if (response.status !== 200 || !response.data || !response.data.eventList) return;

			const rawEventList = await callAndProcessAPI();
			if(!rawEventList || !rawEventList.length) return;

			const [tempGPSList, tempEventList] = await getGPSSensorDataFromEventFiles(
				rawEventList
			);
			if (!tempGPSList.length) return;
			eventList = tempEventList;

			const tempGpsData = rawSmarterAIGPSDataToGeojson(tempGPSList);
			if (!tempGpsData) return;
			gpsData = tempGpsData;
			updateMapCenter(gpsData[0].features[0].geometry.coordinates[0]);
			videoArray = await getVideosFromGpsData(tempGpsData);
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
		{#if selectedMenu.id != 0}
			<div class="col-span-1 lg:col-span-2 flex flex-col gap-4 p-2">
				<Card title="Layers" showOnLoad={true}>
					<Layers bind:layerList {updateMapCenter} />
				</Card>
				{#if selectedMenu.id === 1}
					<Card title="Search Data" showOnLoad={true}>
						<SearchData bind:dateTimeDictionary {fetchEventsData} />
					</Card>
				{:else if selectedMenu.id === 2}
					<Card title="Street View">
						<StreetView bind:selectedPOI />
					</Card>
				{:else if selectedMenu.id === 3}
					<Card title="Video Player">
						<SelectedVideo bind:selectedPOI bind:videoArray />
					</Card>
				{:else if selectedMenu.id === 4}
					<Card title="About">
						<About />
					</Card>
				{/if}
			</div>
		{/if}

		<div class={`col-span-1   ${selectedMenu.id === 0 ? 'col-span-12' : 'col-span-10'}  relative`}>
			<MapboxMap
				bind:videoArray
				bind:mapDetails
				bind:gpsData
				bind:layerList
				bind:mapStyle
				bind:selectedPOI
				bind:selectedMenu
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
