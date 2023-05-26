<script lang="ts">
	import type { IEventType, ISelectedPOIType, IVideoType, SensorQuality } from '$lib/types/eventTypes';
	import type { ILayerListElementType, IMapDetailsType } from '$lib/types/mapTypes';
	import type { IDateTimeDictionaryType, IMenuComponentsType } from '$lib/types/types';

	import Card from '$lib/components/Card.svelte';
	import PaginatedTable from '$lib/components/table/PaginatedTable.svelte';

	import Navbar from '$lib/components/Navbar.svelte';
	import LoadingError from '$lib/components/loading/LoadingError.svelte';
	import LoadingSpinner from '$lib/components/loading/LoadingSpinner.svelte';
	import Layers from '$lib/components/map/Layers.svelte';

	import MapboxMap from '$lib/components/map/MapboxMap.svelte';
	import About from '$lib/components/menu/About.svelte';
	import SearchData from '$lib/components/menu/SearchData.svelte';
	import StreetView from '$lib/components/menu/StreetView.svelte';
	import VideoPlayer from '$lib/components/menu/VideoPlayer.svelte';
	import { getSmarterAiEvents } from '$lib/service/smarter-api';
	import type { IGeojsonDataType, IGeojsonType } from '$lib/types/geojsonTypes';
	import { getSmarterAiGPS } from '$lib/utils/geojson/geojson-utils';
	
	//* Set Initial Map Details

	let mapDetails: IMapDetailsType = {
		id: 0,
		center: [-76.491143, 44.231689],
		zoom: 15,
		pitch: 30,
		bearing: -17.6
	};
	//* Polygon and point of interest details
	let layerList: ILayerListElementType[] = [];
	let selectedPOI: ISelectedPOIType | null = null;
	let selectedPolygon: object | null = null;

	//* Set Payload details for fetching
	let components: IMenuComponentsType[] = [
		{ id: 0, title: 'Only Map', icon: 'fa-times' },
		{ id: 1, title: 'Search Data', icon: 'fa-database' },
		{ id: 2, title: 'Street View', icon: 'fa-road' },
		{ id: 3, title: 'Video Player', icon: 'fa-video' },
		{ id: 4, title: 'About', icon: 'fa-info-circle' }
	];
	let selectedMenu: IMenuComponentsType = components[1];
	let isLoading = false;
	let isError = false;

	let gpsData: IGeojsonType[] = [];
	let eventList: IEventType[] = [];

	const updateMapCenter = (
		coordinates: number[],
		dataType: IGeojsonDataType = 'Point',
		zoomLevel?: number
	) => {
		const zoomLevelMap: { [key in IGeojsonDataType]?: number } = {
			Point: 19,
			LineString: 19,
			Polygon: 15,
			MultiPolygon: 15,
			FeatureCollection: 15,
			Feature: 15,
			GeometryCollection: 15
		};

		const updatedZoomLevel = zoomLevelMap[dataType] || zoomLevel || 15;

		mapDetails = {
			id: 0,
			center: coordinates,
			zoom: updatedZoomLevel,
			pitch: 0,
			bearing: -17.6
		};
	};

	const fetchEventsData = async (dateTimeDictionary: IDateTimeDictionaryType, selectedSensorQuality : SensorQuality) => {
		isLoading = true;
		isError = false;

		try {

			const sensorQualityMap : { [key in SensorQuality]?: number } = {
				Low: 1,
				Medium: 2,
				High: 3
			};
			const sensorQualityValue : number = sensorQualityMap[selectedSensorQuality] || 1;

			// Get all the events from the smarter ai api
			const tempEventList = await getSmarterAiEvents(dateTimeDictionary, sensorQualityValue);
			if (!tempEventList || !tempEventList.length) return;

			const tempGpsData = await getSmarterAiGPS(tempEventList);
			gpsData = tempGpsData;
			eventList = tempEventList;
		} catch (error) {
			alert(error);
			isError = true;
		}

		isLoading = false;
	};

	const updateSelectedPOI = (poi: ISelectedPOIType) => {
		selectedPOI = poi;
	};
</script>

<svelte:head><title>Lynx City Twin</title></svelte:head>

<Navbar bind:selectedMenu bind:components />
<main>
	<div class="relative grid grid-cols-1  2xl:grid-cols-12 bg-smoke">
		{#if selectedMenu.id != 0}
			<div class="col-span-1 2xl:col-span-2 flex flex-col sm:flex-row 2xl:flex-col gap-4 p-2">
				<Card title="Layers" showOnLoad={true} disableToggle={true}>
					<Layers bind:layerList {updateMapCenter} />
				</Card>
				{#if selectedMenu.id === 1}
					<Card title="Search Data" showOnLoad={true} disableToggle={true}>
						<SearchData {fetchEventsData} />
					</Card>
				{:else if selectedMenu.id === 2}
					<Card title="Street View" disableToggle={true}>
						<StreetView bind:selectedPOI />
					</Card>
				{:else if selectedMenu.id === 3}
					<Card title="Video Player" disableToggle={true}>
						<VideoPlayer bind:selectedPOI />
					</Card>
				{:else if selectedMenu.id === 4}
					<Card title="About" disableToggle={true}>
						<About />
					</Card>
				{/if}
			</div>
		{/if}

		<div
			class={` col-span-1   ${
				selectedMenu.id === 0 ? '2xl:col-span-12' : '2xl:col-span-10'
			}  `}
		>
			<MapboxMap
				bind:mapDetails
				bind:gpsData
				bind:layerList
				bind:selectedMenu
				{updateSelectedPOI}
			/>

			
		</div>

		{#if isLoading === true}
				<LoadingSpinner />
			{:else if isError === true}
				<LoadingError />
			{/if}
	</div>

	{#if eventList.length}
		<div class="p-4">
			<Card title="Recordings" width="w-full">
				<PaginatedTable bind:eventList {updateMapCenter} />
			</Card>
		</div>
	{/if}
</main>
