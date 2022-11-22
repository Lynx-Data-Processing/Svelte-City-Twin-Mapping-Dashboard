<script>
// @ts-nocheck

	import Map from "../components/map/Map.svelte";
	import SearchDetails from "../components/menu/SearchDetails.svelte";
	import DateTime from "../components/menu/DateTime.svelte";
	import Layers from "../components/map/Layers.svelte";
	import MapStyleSelector from "../components/map/MapStyleSelector.svelte";
	import Filters from "../components/menu/Filters.svelte";
	import StreetView from "../components/menu/StreetView.svelte";
	import SpeedView from "../components/menu/SpeedView.svelte";
	// import ChartView from "../components/menu/Chart.svelte";
	import Navbar from "../components/Navbar.svelte";

	//import { getBigQueryDataWithPolygon } from "../service/geotab-bigquery.js";
	import { rawGPSDataToGeojson } from "../utils/geojson/geojson-utils.js";
	import { getListOfDevicesUnderTenant, getAllEvents, getGeojsonDataFromFile } from "../service/smarter-api";
	import MapLoadingSpinner from "../components/map/MapLoadingSpinner.svelte";
	import MapError from "../components/map/MapError.svelte";
	import RecordingsTable from "../components/RecordingsTable.svelte";
	//* Set Initial Map Details
	let isReadyForStyleSwitching = false;
	let mapStyle = "outdoors-v11";
	let mapDetails = {
		id: 0,
		center: [-76.5, 44.233334],
		zoom: 11,
		pitch: 0,
		bearing: -17.6,
	};
	//* Polygon and point of interest details
	let layerList = [];
	let pointOfInterest = null;
	let selectedPolygon = null;
	let isMenuOpen = false;
	//* Set Payload details for fetching
	let dateTimeDictionary = {
		startDateTime: "2015-06-23T00:00",
		endDateTime: "2022-12-23T00:00",
	};
	let menuComponents = [
		{ id: 0, title: "Search Data", icon: "fa-database" },
		{ id: 1, title: "Street View", icon: "fa-road" },
		{ id: 2, title: "Filter View", icon: "fa-filter" },
		{ id: 3, title: "Speed & Chart View", icon: "fa-chart-simple" },
	];
	let selectedMenu = menuComponents[0].id;
	let isLoading = true;
	let isError = false;
	let gpsData = [];
	let gpsFilters = [
		{ id: "Speed", name: "Speed Filter", default: [0, 100], step: 10, suffix: "Km/h", selected: [0, 300] },
		{ id: "Reason", name: "Reason Filter", default: [0, 50], step: 5, suffix: "", selected: [0, 50] },
		{ id: "Valid", name: "Valid Filter", default: [0, 1], step: 1, suffix: "", selected: [0, 1] },
		{ id: "Ignition", name: "Ignition Filter", default: [0, 1], step: 1, suffix: "", selected: [0, 1] },
	];
	let devicesArray = [];
	const fetchSmarterAIDevices = async () => {
		const response = await getListOfDevicesUnderTenant();
		if (response.status === 200) {
			if (response.data.endpoints.length > 0) {
				devicesArray = response.data.endpoints;
				console.log(response.data.endpoints);
			} else {
				alert("Not able to fetch devices from Smarter AI");
			}
		} else {
			alert(response);
		}
	};



	const getGPSDataFromSmarterAI = (file) =>{
		getGeojsonDataFromFile(file)
	}
	

	let files = [];
	const fetchBigQueryData = async () => {
		isLoading = true;
		isError = false;
		//* The API expects an API token, date time dictionary for filtering, and an area polygon

		const response = await getAllEvents(dateTimeDictionary.startDateTime, dateTimeDictionary.endDateTime);
		console.log(response);
		if (response && response.status === 200) {
			if (response.data) {
				const eventList = response.data.eventList;
				console.table(eventList);

				//get all the snapshots here from each object
				files = eventList;

				// const gpsRawData = response.apiResult.results;
				// gpsData = rawGPSDataToGeojson(gpsRawData);
				// mapDetails = {
				// 	id: 0,
				// 	center: gpsData[0].features[0].geometry.coordinates,
				// 	zoom: 15,
				// 	pitch: 0,
				// 	bearing: -17.6,
				// };
				alert("Added GPS Data to the Map");
			} else {
				alert("No GPS data found");
			}

			console.log(response)
		} else {
			alert(response);
			isError = true;
		}
		isLoading = false;
	};
</script>

<Navbar title={"City Twin Mapping Dashboard - Kingston"} bind:selectedMenu bind:menuComponents />
<main class="grid grid-cols-1 gap-4 lg:grid-cols-12 my-4 px-4">
	<div class={`col-span-1 lg:col-span-3 flex flex-col gap-4`}>
		<Layers bind:layerList />
		{#if selectedMenu === 0}
			<DateTime bind:dateTimeDictionary />
			<SearchDetails bind:dateTimeDictionary bind:selectedPolygon {fetchBigQueryData} />
		{:else if selectedMenu === 1}
			<StreetView bind:pointOfInterest />
		{:else if selectedMenu === 2}
			<Filters bind:gpsFilters bind:gpsData />
		{:else if selectedMenu === 3}
			<SpeedView bind:gpsData />
			<!-- <ChartView bind:gpsData /> -->
		{/if}
	</div>
	<div class={`col-span-1 lg:col-span-9 relative`}>
		<Map
			bind:devicesArray
			bind:isLoading
			{mapDetails}
			bind:gpsFilters
			bind:gpsData
			bind:layerList
			bind:mapStyle
			bind:isReadyForStyleSwitching
			bind:selectedPolygon
			bind:pointOfInterest
			bind:selectedMenu
		/>

		<MapStyleSelector bind:mapStyle bind:isReadyForStyleSwitching />

		{#if isLoading === true}
			<MapLoadingSpinner />
		{:else if isError === true}
			<MapError />
		{/if}
	</div>
</main>

<section class="grid grid-cols-1 gap-4 lg:grid-cols-12 my-4 px-4">
	{#if files.length}
		<div class="col-span-1 md:col-span-12">
			<RecordingsTable bind:files  {getGPSDataFromSmarterAI}/>
		</div>
	{:else}
		<div class="col-span-1 md:col-span-3">
			<section class="card h-fit scale-in-center">
				<div class="p-4">
					<p class="font-bold my-1">Recordings:</p>
					<div class="alert alert-red my-1" role="alert">No Recordings Found</div>
				</div>
			</section>
		</div>
	{/if}
</section>