<script lang="ts">
	import type { IEventType, ISelectedPOIType, IVideoType } from '$lib/types/eventTypes';
	import type { ILayerListElementType, IMapDetailsType } from '$lib/types/mapTypes';
	import type { IDateTimeDictionaryType, IMenuComponentsType } from '$lib/types/types';

	import Card from '$lib/components/Card.svelte';

	import PaginatedTable from '$lib/components/Events/PaginatedTable.svelte';

	import Layers from '$lib/components/map/Layers.svelte';
	import MapboxMap from '$lib/components/map/MapboxMap.svelte';
	import MapError from '$lib/components/map/MapError.svelte';
	import MapLoadingSpinner from '$lib/components/map/MapLoadingSpinner.svelte';
	import MapStyleSelector from '$lib/components/map/MapStyleSelector.svelte';
	import About from '$lib/components/menu/About.svelte';
	import SearchData from '$lib/components/menu/SearchData.svelte';
	import SelectedVideo from '$lib/components/menu/SelectedVideo.svelte';
	import SelectionMenu from '$lib/components/menu/SelectionMenu.svelte';
	import SpeedView from '$lib/components/menu/SpeedView.svelte';
	import StreetView from '$lib/components/menu/StreetView.svelte';
	import { callAndProcessAPI } from '$lib/service/smarter-api';
	import type { IGeojsonDataType } from '$lib/types/geojsonTypes';
	import { rawSmarterAIGPSDataToGeojson } from '$lib/utils/geojson/geojson-utils';
	import { getGPSSensorDataFromEventFiles } from '$lib/utils/geojson/gpsData-utils';
	import { onMount } from 'svelte';

	//* Set Initial Map Details
	let mapStyle: string = 'mapbox://styles/canaleal/cle0l6bpx004501qotbnxa4wr';
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
	let dateTimeDictionary: IDateTimeDictionaryType = {
		startDateTime: '2022-10-23T00:00',
		endDateTime: '2022-12-23T00:00'
	};

	let isLoading = false;
	let isError = false;
	let gpsData: any[] = [];

	let eventList: IEventType[] = [];

	const updateMapCenter = (
		coordinates: number[],
		dataType?: IGeojsonDataType,
		zoomLevel?: number
	) => {
		let updatedZoomLevel = zoomLevel;
		if (dataType === 'Point' || dataType === 'LineString') {
			updatedZoomLevel = 19;
		} else {
			updatedZoomLevel = 15;
		}

		mapDetails = {
			id: 0,
			center: coordinates,
			zoom: updatedZoomLevel,
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
			const rawEventList = await callAndProcessAPI(dateTimeDictionary);
			if (!rawEventList || !rawEventList.length) return;

			const [tempGPSList, tempEventList] = await getGPSSensorDataFromEventFiles(rawEventList);
			if (!tempGPSList.length) return;
			eventList = tempEventList;

			const tempGpsData = rawSmarterAIGPSDataToGeojson(tempGPSList);
			if (!tempGpsData) return;
			gpsData = tempGpsData;
			updateMapCenter(gpsData[0].features[0].geometry.coordinates[0]);
		} catch (error) {
			alert(error);
			isError = true;
		}

		isLoading = false;
	};

	onMount(() => {
		fetchEventsData();
	});

	let components: IMenuComponentsType[] = [
    {
      id: 0,
      title: 'Only Map',
      component: Layers,
      props: {
        layerList: layerList,
        updateMapCenter: updateMapCenter
      },
      icon: 'fa-times'
    },
    {
      id: 1,
      title: 'Search Data',
      component: SearchData,
      props: {
        dateTimeDictionary: dateTimeDictionary,
        fetchEventsData: fetchEventsData
      },
      icon: 'fa-database'
    },
    {
      id: 2,
      title: 'Street View',
      component: StreetView,
      props: {
        selectedPOI: selectedPOI
      },
      icon: 'fa-road'
    },
    {
      id: 3,
      title: 'Video Player',
      component: SelectedVideo,
      props: {
        selectedPOI: selectedPOI
      },
      icon: 'fa-video'
    },
    {
      id: 4,
      title: 'About',
      component: About,
      props: {},
      icon: 'fa-info-circle'
    }
  ];

	let selectedMenu = components[1];
</script>

<svelte:head><title>Lynx City Twin</title></svelte:head>

<SelectionMenu bind:selectedMenu bind:components />
<main>
	<div class="grid grid-cols-1  2xl:grid-cols-12">
		{#if selectedMenu.id != 0}
			<div class="col-span-1 2xl:col-span-2 flex flex-col sm:flex-row 2xl:flex-col gap-4 p-2">
				<Card title="Layers" showOnLoad={true}>
					<Layers bind:layerList {updateMapCenter} />
				</Card>
				{#each components as component}
					{#if component.id === selectedMenu.id}
						<Card title={component.title}>
							<svelte:component this={component.component} {...component.props} />
						</Card>
					{/if}
				{/each}
			</div>
		{/if}

		<div
			class={`col-span-1   ${
				selectedMenu.id === 0 ? '2xl:col-span-12' : '2xl:col-span-10'
			}  relative`}
		>
			<MapboxMap
				bind:mapDetails
				bind:gpsData
				bind:layerList
				bind:mapStyle
				bind:selectedPOI
				bind:selectedMenu
			/>

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

	{#if eventList.length}
		<div class="p-4">
			<Card title="Recordings" width="w-full" disableToggle={true}>
				<PaginatedTable bind:eventList {updateMapCenter} />
			</Card>
		</div>
	{/if}
</main>
