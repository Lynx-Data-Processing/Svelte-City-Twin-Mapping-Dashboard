<script lang="ts">
	import type { ISelectedPOIType } from '$lib/types/eventTypes';
	import type { ILayerListElementType, IMapDetailsType, IMapStyle } from '$lib/types/mapTypes';
	import type { IMenuComponentsType } from '$lib/types/types';
	import { axiosCacheGetUtility } from '$lib/service/fetch-data';
	import { rawKingstonDataToGeojsonData } from '$lib/utils/geojson/kingston-geojson-util';
	import { buildPopup } from '$lib/utils/popup-builder';
	import { onMount } from 'svelte';

	import {
		PUBLIC_MAPBOX_KEY,
	} from '$env/static/public';

	import { 
		OPEN_DATA_KINGSTON_CITY_ZONES_URL
	} from "$lib/constants/global"

	import { getRandomColor } from "$lib/utils/color-utils"

	import MapboxDraw from '@mapbox/mapbox-gl-draw';
	import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
	import mapboxgl from 'mapbox-gl';

	import {
	addLayerListElementToLayerList,
		addLayerSource,
		addMapLayerVisibility,
		getInitialCoordinates,
		removeExistingLayerFromMap,
		removeExistingSourceFromMap,
		resizeMap,
		updateMapCenter
	} from '$lib/utils/mapboxMap/mapboxMap-utils';

	import { checkIfElementExists, removeObjectWhereValueEqualsString } from '$lib/utils/filter-data';
	import {
		addBuildingLayer,
		addLineLayer,
		addPointLayer,
		addPolygonLayer,
		addTerrainLayer
	} from '$lib/utils/mapboxMap/mapboxMap-layers-utils';
	import Card from '../Card.svelte';
	import MapLegend from './MapLegend.svelte';
	import MapStyleSelector from './MapStyleSelector.svelte';
	import { mapStyles } from '$lib/utils/mapboxMap/mapboxMap-styles';

	// ------------------ Mapbox ------------------
	export let layerList: ILayerListElementType[];
	export let selectedPolygon = null;
	export let mapDetails: IMapDetailsType;
	export let updateSelectedPOI: (selectedPOI: ISelectedPOIType) => void;
	export let selectedMenu: IMenuComponentsType;
	export let gpsData: any;


	let mapboxMap: any = null;
	let selectedMapStyle: IMapStyle = mapStyles[1];

	const smallPopup = new mapboxgl.Popup();
	const draw = new (MapboxDraw as any)({
		displayControlsDefault: false,
		controls: {
			polygon: true,
			trash: true
		},
		defaultMode: 'simple_select'
	});



	const fetchInitialMapData = async () => {
		const buildingElement: ILayerListElementType = {
			id: Math.floor(Math.random() * 100),
			icon: 'fa-solid fa-building',
			type: 'Feature',
			isShown: true,
			layerName: '3D-Buildings',
			hasFilter: false,
			sourceName: 'composite',
			color: 'Black',
		};
		layerList = addLayerListElementToLayerList(layerList, buildingElement);

		const neighborhoodsResponse = await axiosCacheGetUtility(
			OPEN_DATA_KINGSTON_CITY_ZONES_URL
		);
		if (neighborhoodsResponse.status === 200) {
			const neighborhoodsData = neighborhoodsResponse.data.records;
			if (!neighborhoodsData.length) return;

			const neighborhoodsGpsData = rawKingstonDataToGeojsonData(
				neighborhoodsData,
				'Neighborhoods',
				'Polygon'
			);

			if (!neighborhoodsGpsData) return;

			const neighborhoodsElement: ILayerListElementType = {
				id: Math.floor(Math.random() * 100),
				icon: 'fa-solid fa-table-cells-large',
				type: 'Polygon',
				isShown: false,
				layerName: 'Neighborhoods',
				hasFilter: false,
				sourceName: 'NeighborhoodsSource',
				initialCoordinates: getInitialCoordinates('Polygon', neighborhoodsGpsData),
				color: 'Blue',
				data: neighborhoodsGpsData
			};
			layerList = addLayerListElementToLayerList(layerList, neighborhoodsElement);
		} else {
			console.log(`Unable to load data for ${OPEN_DATA_KINGSTON_CITY_ZONES_URL}`);
		}
	};

	const addLayerOnMap = (layerElement: ILayerListElementType) => {
		if (layerElement.layerName.includes('Buildings')) {
			addBuildingLayer(mapboxMap, layerElement);
		}

		if (layerElement.type === 'Polygon') {
			addPolygonLayer(mapboxMap, smallPopup, layerElement, 0.5, ['get', 'Color']);
		}

		if (layerElement.type === 'Point') {
			addPointLayer(
				mapboxMap,
				smallPopup,
				layerElement,
				'Size',
				['get', 'Color'],
				updateSelectedPOI,
				buildPopup
			);
		}

		if (layerElement.type === 'LineString') {
			addLineLayer(
				mapboxMap,
				smallPopup,
				layerElement,
				8,
				['get', 'Color'],
				updateSelectedPOI,
				buildPopup
			);
		}
	};

	const addExistingDynamicGPSElements = () => {
		if (!mapboxMap || !layerList.length) return;

		addTerrainLayer(mapboxMap);
		for (let i = 0, len = layerList.length; i < len; i++) {
			const layerElement = layerList[i];
			
			if (!layerElement.layerName.includes('Buildings')) {
				addLayerSource(mapboxMap, layerElement.sourceName, layerElement.data);
			}
			addLayerOnMap(layerElement);
		}
	};

	const addNewDynamicGPSElements = () => {
		if (!mapboxMap || !gpsData.length) return;

		for (let i = 0, len = gpsData.length; i < len; i++) {
			const gpsElement = gpsData[i];
			const { dataName, dataType, hasFilter, dataSourceName } = gpsElement;
			const layerElement: ILayerListElementType = {
				id: Math.floor(Math.random() * 100),
				layerName: dataName,
				sourceName: dataSourceName,
				type: dataType,
				isShown: true,
				icon: 'fa-solid fa-car',
				hasFilter: hasFilter,
				color: getRandomColor(),
				data: gpsElement,
				initialCoordinates: getInitialCoordinates(dataType, gpsElement),
			};

			layerList = addLayerListElementToLayerList(layerList, layerElement);
			addLayerSource(mapboxMap, layerElement.sourceName, layerElement.data);
			addLayerOnMap(layerElement);
		}
	};


	export const switchStyle = ( newMapStyle: IMapStyle) => {
		if (!mapboxMap) return;
		selectedMapStyle = newMapStyle;
		mapboxMap.setStyle(newMapStyle.value);
	};


	//Update the polygon using the features property
	const updatePolygon = ({}) => {
		const data = draw.getAll();
		if (data.features.length > 0) {
			selectedPolygon = data.features[0];
		}
	};

	const clearPolygon = () => {
		draw.deleteAll();
		selectedPolygon = null;
	};

	// If any of the values change then call the function
	$: mapboxMap && gpsData && addNewDynamicGPSElements();
	$: mapboxMap && mapDetails && updateMapCenter(mapboxMap, mapDetails);
	$: mapboxMap && selectedMenu && resizeMap(mapboxMap);
	$: mapboxMap && layerList && addMapLayerVisibility(mapboxMap, layerList);

	onMount(async () => {



		await fetchInitialMapData();

		mapboxgl.accessToken = PUBLIC_MAPBOX_KEY;
		mapboxMap = new mapboxgl.Map({
			center: mapDetails.center,
			zoom: mapDetails.zoom,
			pitch: mapDetails.pitch,
			bearing: mapDetails.bearing,
			container: 'mapboxMap',
			antialias: true,
			style: selectedMapStyle.value
			
		});

		mapboxMap.addControl(draw, 'bottom-left');
		mapboxMap.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
		mapboxMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
		mapboxMap.on('draw.create', updatePolygon);
		mapboxMap.on('draw.delete', clearPolygon);
		mapboxMap.on('draw.update', updatePolygon);
		mapboxMap.on('contextmenu', clearPolygon);
		

		mapboxMap.on('style.load', function () {
			addExistingDynamicGPSElements();
		});

	});
</script>

<div class="h-screen relative scale-in-center">
	<div class="h-full" id="mapboxMap" />


	<div class="absolute top-2 left-2 flex flex-col gap-4 z-100 align-right">
		<Card title="Map Style" width="w-[14rem]" showOnLoad={false}>
			<MapStyleSelector bind:selectedMapStyle {mapStyles} {switchStyle} />
		</Card>

		<Card title="Speed Legend" showOnLoad={false} >
			<MapLegend />
		</Card>
	</div>
</div>
