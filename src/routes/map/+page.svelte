<script lang="ts">
	import type { ISelectedPOIType } from '$lib/types/eventTypes';
	import {
		zoomLevelMap,
		type ILayerListElementType,
		type IMapDetailsType,
		type ILatLngType
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
	import { getSmarterAiTripWithGps, getSmarterAiTrips } from '$lib/service/smarter-api';
	import type { IGeojsonDataType, IGeojsonType } from '$lib/types/geojsonTypes';
	import type { ITrip } from '$lib/types/tripTypes';
	import { convertTripsToGeoJSON } from '$lib/utils/geojson/geojson-trips-utils';
	import { onMount } from 'svelte';
	import {
		getInitialCoordinates,
		getKingstonMapData
	} from '$lib/utils/geojson/kingston-geojson-util';

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

	//* Set Payload details for fetching
	let components: IMenuComponentsType[] = [
		{ id: 1, title: 'Search Data', icon: 'fa-database' },
		{ id: 2, title: 'Video Player', icon: 'fa-video' },
		{ id: 3, title: 'About', icon: 'fa-info-circle' }
	];
	let selectedMenu: IMenuComponentsType = components[0];

	let tripList: ITrip[] = [];

	export const addLayerListElementToLayerList = (
		layerList: ILayerListElementType[],
		layerListElement: ILayerListElementType
	) => {
		let tempLayerList = layerList;
		if (checkIfElementExists(tempLayerList, 'layerName', layerListElement.layerName)) {
			tempLayerList = removeObjectWhereValueEqualsString(
				tempLayerList,
				'layerName',
				layerListElement.layerName
			);
		}
		tempLayerList.push(layerListElement);
		return tempLayerList;
	};

	const fetchTripsData = async (dateTimeDictionary: IDateTimeDictionaryType) => {
		isLoading = true;
		isError = false;

		try {
			const tempTripList = await getSmarterAiTrips(dateTimeDictionary);
			if (!tempTripList || !tempTripList.length) return;

			let tempTripWithGPSList: ITrip[] = [];
			for (let i = 0; i < tempTripList.length; i++) {
				const trip = tempTripList[i];
				const tempTripWithGPS = await getSmarterAiTripWithGps(trip.id);
				tempTripWithGPSList.push(tempTripWithGPS);
			}

			const tempGeojsonData: IGeojsonType[] = await convertTripsToGeoJSON(tempTripWithGPSList);
			for (let i = 0, len = tempGeojsonData.length; i < len; i++) {
				const gpsElement = tempGeojsonData[i];
				const layerElement: ILayerListElementType = {
					id: Math.floor(Math.random() * 100),
					layerName: gpsElement.features[0].properties.endpointName || 'GPS Data',
					sourceName: gpsElement.features[0].properties.endpointName || 'GPS Data',
					type: 'LineString',
					isVisible: true,
					icon: 'fa-solid fa-car',
					color: 'black',
					geojson: gpsElement,
					initialCoordinates: getInitialCoordinates('LineString', gpsElement)
				};
				layerElement.googleMapLayer = new google.maps.Data();
				layerList = addLayerListElementToLayerList(layerList, layerElement);
				addLayerToGoogleMap(layerElement);
				toggleGoogleMapLayerVisibility(layerElement);
			}
			tripList = tempTripWithGPSList;
		} catch (error) {
			isError = true;
		}

		isLoading = false;
	};

	import type { Map } from 'google.maps';
	import { checkIfElementExists, removeObjectWhereValueEqualsString } from '$lib/utils/filter-data';
	import { MULTI_POLYGON, POLYGON } from '$lib/constants/geojson';
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
		const tempLayerList = [];
		const tempKingstonLayerList = await getKingstonMapData();
		if (!tempKingstonLayerList || !tempKingstonLayerList.length) return;
		tempLayerList.push(...tempKingstonLayerList);

		for (let i = 0, len = tempLayerList.length; i < len; i++) {
			const layerElement = tempLayerList[i];
			layerElement.googleMapLayer = new google.maps.Data();
			layerList = addLayerListElementToLayerList(layerList, layerElement);
			addLayerToGoogleMap(layerElement);
			toggleGoogleMapLayerVisibility(layerElement);
		}
	};

	const addLayerToGoogleMap = (layerListElement: ILayerListElementType) => {
		if (!map || !layerListElement.geojson) return;
		const layer = layerListElement.googleMapLayer;
		layer.addGeoJson(layerListElement.geojson);
		layer.setStyle((feature: { getProperty: (arg0: string) => any }) => {
			const geometryType = layerListElement.type;
			const color =
				feature.getProperty('color') || '#' + Math.floor(Math.random() * 16777215).toString(16);
			let style: google.maps.Data.StyleOptions = {
				strokeColor: color || 'blue',
				strokeWeight: 4
			};

			if (geometryType === POLYGON || geometryType === MULTI_POLYGON) {
				style = {
					...style,
					strokeColor: color,
					fillColor: color,
					fillOpacity: 0.3
				};
			}

			return style;
		});

		layer.addListener('click', (event: { feature: { getProperty: (arg0: string) => any; }; }) => {
		const properties = event.feature.getProperty('color');
		if (properties) {
			// Display properties in a popup or console.log them
			console.log(properties);
		}
	});
	};

	const toggleGoogleMapLayerVisibility = (layerElement: ILayerListElementType) => {
		if (!map && layerElement.googleMapLayer) return;
		if (layerElement.isVisible) {
			layerElement.googleMapLayer.setMap(map); // Show the layer on the map
		} else {
			layerElement.googleMapLayer.setMap(null); // Hide the layer from the map
		}
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
					<Layers {layerList} {updateMapCenter} {toggleGoogleMapLayerVisibility} />
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
			<div class="h-screen scale-in-center">
				<div bind:this={mapDiv} class="h-full w-full " />
			</div>
		</div>

		{#if isLoading === true}
			<LoadingSpinner />
		{:else if isError === true}
			<LoadingError />
		{/if}
	</div>

	{#if tripList.length}
		<div class="p-4">
			<Card title="Trips" width="w-full">
				<PaginatedTable bind:tableData={tripList} {updateMapCenter} />
			</Card>
		</div>
	{/if}
</div>
