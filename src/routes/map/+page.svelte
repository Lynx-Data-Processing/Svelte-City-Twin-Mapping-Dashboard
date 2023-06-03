<script lang="ts">
	import type { ISelectedPOIType } from '$lib/types/eventTypes';
	import {
		zoomLevelMap,
		type ILatLngType,
		type ILayerListElementType,
		type IMapDetailsType
	} from '$lib/types/mapTypes';
	import type { IDateTimeDictionaryType, IMenuComponentsType } from '$lib/types/types';

	import Card from '$lib/components/Card.svelte';
	import PaginatedTable from '$lib/components/table/PaginatedTable.svelte';

	import Navbar from '$lib/components/Navbar.svelte';
	import LoadingError from '$lib/components/loading/LoadingError.svelte';
	import LoadingSpinner from '$lib/components/loading/LoadingSpinner.svelte';
	import Layers from '$lib/components/map/Layers.svelte';

	import About from '$lib/components/menu/About.svelte';
	import SearchData from '$lib/components/menu/SearchData.svelte';
	import VideoPlayer from '$lib/components/menu/VideoPlayer.svelte';
	import { LINE_STRING } from '$lib/constants/geojson';
	import { getSmarterAiTripWithGps, getSmarterAiTrips } from '$lib/service/smarter-api';
	import type { IGeojsonDataType, IGeojsonType } from '$lib/types/geojsonTypes';
	import type { ITrip } from '$lib/types/tripTypes';
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
		zoom: 18,
		tilt: 60,
		heading: -17.6
	};

	let layerList: ILayerListElementType[] = [];
	let selectedPOI: ISelectedPOIType | null = null;
	let selectedPolygon: object | null = null;
	let components: IMenuComponentsType[] = [
		{ id: 1, title: 'Search Data', icon: 'fa-database' },
		{ id: 2, title: 'Video Player', icon: 'fa-video' },
		{ id: 3, title: 'About', icon: 'fa-info-circle' }
	];
	let selectedMenu: IMenuComponentsType = components[0];

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

	const getInitialMapData = async () => {
		const tempKingstonLayerList = await getKingstonMapData();
		if (!tempKingstonLayerList || !tempKingstonLayerList.length) return;
		for (let i = 0, len = tempKingstonLayerList.length; i < len; i++) {

			layerList = addLayerElementToLayerList(layerList, tempKingstonLayerList[i]);
			map = addLayerToGoogleMap(map, tempKingstonLayerList[i]);
			map = toggleGoogleMapLayerVisibility(map, tempKingstonLayerList[i]);
		}
	};

	const toggleGoogleLayer = (layerElement: ILayerListElementType) => {
		toggleGoogleMapLayerVisibility(map, layerElement);
	};

	const fetchTripsData = async (dateTimeDictionary: IDateTimeDictionaryType) => {
		isLoading = true;
		isError = false;

		try {
			const tempTripList = await getSmarterAiTrips(dateTimeDictionary);
			if (!tempTripList || !tempTripList.length) return;

			let tempTripWithGPSList: ITrip[] = [];
			for (let i = 0; i < tempTripList.length; i++) {
				const tempTripWithGPS = await getSmarterAiTripWithGps(tempTripList[i].id);
				if (!tempTripWithGPS) continue;
				tempTripWithGPSList.push(tempTripWithGPS);
			}

			const tempGeojsonData: IGeojsonType[] = await convertTripsToGeoJSON(tempTripWithGPSList);
			for (let i = 0, len = tempGeojsonData.length; i < len; i++) {
				const gpsElement = tempGeojsonData[i];

				const layerElement = createLayerElement(
					false,
					gpsElement.features[0].properties.endpointName,
					LINE_STRING,
					true,
					'fa-solid fa-car',
					'black',
					gpsElement
				);

				layerList = addLayerElementToLayerList(layerList, layerElement);
				map = addLayerToGoogleMap(map, layerElement);
				map = toggleGoogleMapLayerVisibility(map, layerElement);
			}
			tripList = tempTripWithGPSList;
		} catch (error) {
			isError = true;
			console.log(error)
		}

		isLoading = false;
	};

	onMount(() => {
		initializeMap();
		getInitialMapData();
	});
</script>

<svelte:head><title>Lynx City Twin</title></svelte:head>

<Navbar bind:selectedMenu bind:components />
<div>
	<div class="grid grid-cols-1  2xl:grid-cols-12 ">
		{#if selectedMenu.id != 0}
			<div class="col-span-1 2xl:col-span-2 flex flex-col sm:flex-row 2xl:flex-col p-4 gap-4">
				<Card title="Layers" showOnLoad={true} disableToggle={true}>
					<Layers {layerList} {updateMapCenter} {toggleGoogleLayer} />
				</Card>
				{#if selectedMenu.id === 1}
					<Card title="Search Data" showOnLoad={true} disableToggle={true}>
						<SearchData {fetchTripsData} />
					</Card>
				{:else if selectedMenu.id === 2}
					<Card title="Video Player" disableToggle={true}>
						<VideoPlayer {selectedPOI} />
					</Card>
				{:else if selectedMenu.id === 3}
					<Card title="About" disableToggle={true}>
						<About />
					</Card>
				{/if}
			</div>
		{/if}

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
