<script lang="ts">
	import type { ISelectedPOIType } from '$lib/types/eventTypes';
	import type { ILayerListElementType, IMapDetailsType, IMapStyle } from '$lib/types/mapTypes';
	import type { IMenuComponentsType } from '$lib/types/types';
	import { axiosCacheGetUtility } from '$lib/utils/fetch-data';
	import { rawKingstonDataToGeojsonData } from '$lib/utils/geojson/kingston-geojson-util';
	import { buildPopup } from '$lib/utils/popup-builder';
	import { onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	import {
		PUBLIC_MAPBOX_KEY,
		PUBLIC_OPEN_DATA_KINGSTON_CITY_ZONES_URL,
	} from '$env/static/public';

	import MapboxDraw from '@mapbox/mapbox-gl-draw';
	import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
	import mapboxgl from 'mapbox-gl';

	import {
		addLayerSource,
		addMapLayerVisibility,
		getInitialCoordinates,
		removeExistingLayerFromMap,
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

	// ------------------ Mapbox ------------------
	export let layerList: ILayerListElementType[];
	export let selectedPolygon = null;
	export let mapDetails: IMapDetailsType;
	export let updateSelectedPOI: (selectedPOI: ISelectedPOIType) => void;
	export let selectedMenu: IMenuComponentsType;
	export let gpsData: any;


	let mapboxMap: any = null;
	
	const mapStyles: IMapStyle[] = [
		{
			id: 0,
			name: 'Streets',
			value: 'mapbox://styles/mapbox/streets-v11',
			image: 'https://assets.website-files.com/5e83362767d71ffd59a0c8a9/5ea01b977fb48a501b898a93_ipad-map%20streets.png'
		},

		{
			id: 1,
			name: 'Dark',
			value: 'mapbox://styles/mapbox/dark-v10',
			image: 'https://assets.website-files.com/5e83362767d71ffd59a0c8a9/5ea01810f9a5b1c55841ee6f_ipad-map%20dark.png'
		},
		{
			id: 2,
			name: 'Outdoors',
			value: 'mapbox://styles/canaleal/cle0l6bpx004501qotbnxa4wr',
			image: 'https://assets.website-files.com/5e83362767d71ffd59a0c8a9/5ea01bd0779fa266f900ba3c_ipad-map%20outdoors.png'
		},
		{
			id: 3,
			name: 'Satellite',
			value: 'mapbox://styles/mapbox/satellite-streets-v11',
			image: 'https://assets.website-files.com/5e83362767d71ffd59a0c8a9/6025417270820571127804d8_ipad-map.png'
		},
		{
			id: 4,
			name: 'Dark - Traffic',
			value: 'mapbox://styles/mapbox/navigation-night-v1',
			image: 'https://assets.website-files.com/5e83362767d71ffd59a0c8a9/5ea01810f9a5b1c55841ee6f_ipad-map%20dark.png'
		},
		{
			id: 5,
			name: 'Light - Traffic',
			value: 'mapbox://styles/mapbox/navigation-day-v1',
			image: 'https://assets.website-files.com/5e83362767d71ffd59a0c8a9/5ea01b977fb48a501b898a93_ipad-map%20streets.png'
		}
	];
	let selectedMapStyle: IMapStyle = mapStyles[0];

	const smallPopup = new mapboxgl.Popup();
	const draw = new (MapboxDraw as any)({
		displayControlsDefault: false,
		controls: {
			polygon: true,
			trash: true
		},
		defaultMode: 'simple_select'
	});

	const addLayerListElementToLayerList = (layerListElement: ILayerListElementType) => {
		let tempLayerList = layerList;
		if (checkIfElementExists(tempLayerList, 'layerName', layerListElement.layerName)) {
			tempLayerList = removeObjectWhereValueEqualsString(
				tempLayerList,
				'layerName',
				layerListElement.layerName
			);
		}
		tempLayerList.push(layerListElement);
		layerList = tempLayerList;
	};

	const fetchInitialMapData = async () => {
		const buildingElement: ILayerListElementType = {
			id: Math.floor(Math.random() * 100),
			icon: 'fa-building',
			type: 'Feature',
			isShown: true,
			layerName: '3D-Buildings',
			hasFilter: false,
			sourceName: 'composite',
			color: 'Black'
		};
		addLayerListElementToLayerList(buildingElement);

		const neighborhoodsResponse = await axiosCacheGetUtility(
			PUBLIC_OPEN_DATA_KINGSTON_CITY_ZONES_URL
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
				icon: 'fa-border-all',
				type: 'Polygon',
				isShown: true,
				layerName: 'Neighborhoods',
				hasFilter: false,
				sourceName: 'NeighborhoodsSource',
				initialCoordinates: getInitialCoordinates('Polygon', neighborhoodsGpsData),
				color: 'Blue',
				data: neighborhoodsGpsData
			};
			addLayerListElementToLayerList(neighborhoodsElement);
		} else {
			console.log(`Unable to load data for ${PUBLIC_OPEN_DATA_KINGSTON_CITY_ZONES_URL}`);
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
			removeExistingLayerFromMap(mapboxMap, layerElement.layerName);
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
				id: uuidv4(),
				layerName: dataName,
				sourceName: dataSourceName,
				type: dataType,
				isShown: true,
				icon: 'fa-road',
				hasFilter: hasFilter,
				color: 'Random',
				data: gpsElement
			};

			addLayerListElementToLayerList(layerElement);
			removeExistingLayerFromMap(mapboxMap, layerElement.layerName);
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

	$: mapboxMap && gpsData && addNewDynamicGPSElements();
	$: mapboxMap && mapDetails && updateMapCenter(mapboxMap, mapDetails);
	$: mapboxMap && selectedMenu && resizeMap(mapboxMap);

	onMount(async () => {
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

		await fetchInitialMapData();

		mapboxMap.on('style.load', function () {
			addExistingDynamicGPSElements();
			if (gpsData) addExistingDynamicGPSElements();
		});

		mapboxMap.on('idle', () => {
			addMapLayerVisibility(mapboxMap, layerList);
		});
	});
</script>

<div class="h-screen relative scale-in-center">
	<div class="h-full" id="mapboxMap" />


	<div class="absolute top-2 left-2 flex flex-col gap-4 z-100 align-right">
		<Card title="Map Style" >
			<MapStyleSelector bind:selectedMapStyle {mapStyles} {switchStyle} />
		</Card>

		<Card title="Speed Legend" showOnLoad={false} width="w-[15rem]">
			<MapLegend />
		</Card>
	</div>
</div>
