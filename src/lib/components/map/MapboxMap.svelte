<script lang="ts">
	import type { ISelectedPOIType } from '$lib/types/eventTypes';
	import type { IGeojsonDataType, IGeojsonType } from '$lib/types/geojsonTypes';
	import type { ILayerListElementType, IMapDetailsType } from '$lib/types/mapTypes';
	import type { IMenuComponentsType } from '$lib/types/types';
	import { onDestroy, onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { axiosCacheGetUtility } from '$lib/utils/fetch-data';
	import { rawKingstonDataToGeojsonData } from '$lib/utils/geojson/kingston-geojson-util';
	import { buildPopup } from '$lib/utils/popup-builder';

	import {
		PUBLIC_MAPBOX_KEY,
		PUBLIC_OPEN_DATA_KINGSTON_CITY_ZONES_URL,
		PUBLIC_PLANNING_POINT_URL,
		PUBLIC_TREES_URL
	} from '$env/static/public';

	import MapboxDraw from '@mapbox/mapbox-gl-draw';
	import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

	import mapboxgl from 'mapbox-gl';

	import { addLayerSource, getInitialCoordinates, removeExistingLayerFromMap } from '$lib/utils/mapboxMap/mapboxMap-utils';

	import { checkIfElementExists, removeObjectWhereValueEqualsString } from '$lib/utils/filter-data';
	import {
		addBuildingLayer,
		addPolygonLayer,
		addTerrainLayer
	} from '$lib/utils/mapboxMap/mapboxMap-layers-utils';

	// ------------------ Mapbox ------------------
	export let layerList: ILayerListElementType[];
	export let selectedPolygon = null;
	export let mapStyle: string;
	export let mapDetails: IMapDetailsType;
	export let updateSelectedPOI: (selectedPOI: ISelectedPOIType) => void;
	export let selectedMenu: IMenuComponentsType;
	export let gpsData: any;

	let mapboxMap: any = null;
	let isInitialDataLoaded = false;

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

	const fetchDataFromAPI = async (
		url: string,
		layerName: string,
		dataType: IGeojsonDataType = 'Point',
		dataColor?: string
	) => {
		try {
			const response = await axiosCacheGetUtility(url);
			if (response.status === 200) {
				const rawData = response.data.records;
				if (!rawData.length) return;
				return rawKingstonDataToGeojsonData(rawData, layerName, dataType, dataColor);
				
			} else {
				console.log(`Unable to load data for ${layerName}`);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const fetchInitialMapData = async () => {

		const buildingElement: ILayerListElementType = {
			id: Math.floor(Math.random() * 100),
			icon: "fa-building",
			type: "Feature",
			isShown: true,
			layerName: "3D-Buildings",
			hasFilter: false,
			sourceName: "composite",
			color: 'Black',
		};
		addLayerListElementToLayerList(buildingElement);

		const neighborhoodsData = await fetchDataFromAPI(
			PUBLIC_OPEN_DATA_KINGSTON_CITY_ZONES_URL,
			'Neighborhoods',
			'Polygon'
		);
		const neighborhoodsElement: ILayerListElementType = {
			id: Math.floor(Math.random() * 100),
			icon: "fa-border-all",
			type: "Polygon",
			isShown: true,
			layerName: "Neighborhoods",
			hasFilter: false,
			sourceName: "NeighborhoodsSource",
			initialCoordinates: getInitialCoordinates("Polygon", neighborhoodsData),
			color: 'Blue',
			data: neighborhoodsData,
		};
		addLayerListElementToLayerList(neighborhoodsElement);
	};

	// ------------------ Mapbox Map adding Layers ------------------ //
	export const addLineLayer = (
		mapboxMap: any,
		smallPopup: any,
		layerElement: ILayerListElementType,
		lineWidth = 4,
		color = ['red']
	) => {
		try {
		
			mapboxMap.addLayer({
				id: layerElement.layerName,
				type: 'line',
				source: layerElement.sourceName,
				layout: {
					'line-join': 'round',
					'line-cap': 'round'
				},
				paint: {
					'line-color': color,
					'line-width': lineWidth,
					
				}
			});

			mapboxMap.on('click', layerElement.layerName, async (e: any) => {
				updateSelectedPOI({ lat: e.lngLat.lat, lng: e.lngLat.lng, data: e.features[0].properties });

				smallPopup
					.setLngLat(e.lngLat)
					.setHTML(
						e?.features
							? await buildPopup(e.features[0], layerElement.layerName)
							: '<div>Properties do not exist</div>'
					)
					.addTo(mapboxMap);
			});

			// Change the cursor to a pointer when the mouse is over the places layer.
			mapboxMap.on('mouseenter', layerElement.layerName, () => {
				mapboxMap.getCanvas().style.cursor = 'pointer';
			});
			// Change it back to a pointer when it leaves.
			mapboxMap.on('mouseleave', layerElement.layerName, () => {
				mapboxMap.getCanvas().style.cursor = '';
			});
		} catch (e) {
			console.log(e);
		}
	};

	export const addPointLayer = (
		mapboxMap: any,
		smallPopup: any,
		layerElement: ILayerListElementType,
		pointSizeName = 'Size',
		color = ['Blue']
	) => {
		try {
			mapboxMap.addLayer(
				{
					id: layerElement.layerName,
					type: 'circle',
					source: layerElement.sourceName,
					minzoom: 1,
					paint: {
						'circle-radius': [
							'interpolate',
							['linear'],
							['zoom'],
							7,
							['interpolate', ['linear'], ['get', pointSizeName], 1, 2, 3, 4],
							16,
							['interpolate', ['linear'], ['get', pointSizeName], 3, 6, 9, 12]
						],
						'circle-color': color
					}
				},
				'waterway-label'
			);
			mapboxMap.setLayoutProperty(layerElement.layerName, 'visibility', 'none');
			mapboxMap.moveLayer(layerElement.layerName);

			mapboxMap.on('click', layerElement.layerName, async (e: any) => {
				updateSelectedPOI({ lat: e.lngLat.lat, lng: e.lngLat.lng, data: e.features[0].properties });

				smallPopup
					.setLngLat(e.lngLat)
					.setHTML(
						e?.features
							? await buildPopup(e.features[0], layerElement.layerName)
							: '<div>Properties do not exist</div>'
					)
					.addTo(mapboxMap);
			});

			// Change the cursor to a pointer when the mouse is over the places layer.
			mapboxMap.on('mouseenter', layerElement.layerName, () => {
				mapboxMap.getCanvas().style.cursor = 'pointer';
			});
			// Change it back to a pointer when it leaves.
			mapboxMap.on('mouseleave', layerElement.layerName, () => {
				mapboxMap.getCanvas().style.cursor = '';
			});
		} catch (err) {
			console.log(err);
		}
	};
	// ------------------ Map Layer functions ------------------ //

	// ------------------ Map Layer functions ------------------ //
	const addLayerOnMap = (layerListElement: ILayerListElementType) => {

		
		if (layerListElement.layerName.includes('Buildings')) {
			addBuildingLayer(mapboxMap, layerListElement);
		}

		if (layerListElement.type === 'Polygon') {
			addPolygonLayer(mapboxMap, smallPopup, layerListElement, 0.5, ['get', 'Color']);
		}

		if (layerListElement.type === 'Point') {
			addPointLayer(mapboxMap, smallPopup, layerListElement, 'Size', ['get', 'Color']);
		}

		if (layerListElement.type === 'LineString') {
			addLineLayer(
				mapboxMap,
				smallPopup,
				layerListElement,
				8,
				['get', 'Color']
				
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
		isInitialDataLoaded = true;
	};

	const addNewDynamicGPSElements = () => {
		if (!mapboxMap || !gpsData.length) return;

		for(let i = 0, len = gpsData.length ; i < len ; i++){
			const gpsElement = gpsData[i];
			const { dataName, dataType, hasFilter, dataSourceName } = gpsElement;
			const layerElement : ILayerListElementType = {
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
	// ------------------ Map Layer functions ------------------ //

	// ------------------ Map Style functions ------------------ //
	const switchStyle = () => {
		if (!mapboxMap || !isInitialDataLoaded) return;
		mapboxMap.setStyle(mapStyle);
	};

	const addMapLayerVisibility = () => {
		if (!mapboxMap || !layerList) return;

		for (let i = 0, len = layerList.length; i < len; i++) {
			const layerElement = layerList[i];
			mapboxMap.setLayoutProperty(
				layerElement.layerName,
				'visibility',
				layerElement.isShown ? 'visible' : 'none'
			);
		}
	};

	const updateMapCenter = () => {
		if (!mapboxMap) return;
		mapboxMap.flyTo({
			center: mapDetails.center,
			zoom: mapDetails.zoom
		});
	};

	//Update the polygon using the features property
	const updatePolygon = ({}) => {
		try {
			const data = draw.getAll();
			if (data.features.length > 0) {
				selectedPolygon = data.features[0];
			}
		} catch (err) {
			console.log(err);
		}
	};
	//Remove the selected polygon
	const clearPolygon = () => {
		try {
			draw.deleteAll();
			selectedPolygon = null;
		} catch (err) {
			console.log(err);
		}
	};
	// ------------------ Map Style functions ------------------ //

	const resizeMap = () => {
		if (!mapboxMap) return;
		mapboxMap.resize();
	};

	$: mapboxMap && mapStyle && switchStyle();
	$: mapboxMap && gpsData && addNewDynamicGPSElements();
	$: mapboxMap && mapDetails && updateMapCenter();
	$: mapboxMap && selectedMenu && resizeMap();

	onMount(async () => {
		mapboxgl.accessToken = PUBLIC_MAPBOX_KEY;
		mapboxMap = new mapboxgl.Map({
			center: mapDetails.center,
			zoom: mapDetails.zoom,
			pitch: mapDetails.pitch,
			bearing: mapDetails.bearing,
			container: 'mapboxMap',
			antialias: true,
			style: mapStyle
		});
		// Get the initial Data
		await fetchInitialMapData();
		mapboxMap.addControl(draw, 'bottom-left');

		mapboxMap.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
		mapboxMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
		mapboxMap.on('style.load', function () {
			addExistingDynamicGPSElements();
			if (gpsData) addExistingDynamicGPSElements();
		});
		
		mapboxMap.on('idle', () => {
			addMapLayerVisibility();
		});

		mapboxMap.on('draw.create', updatePolygon);
		mapboxMap.on('draw.delete', clearPolygon);
		mapboxMap.on('draw.update', updatePolygon);
		mapboxMap.on('contextmenu', clearPolygon);
	});
	onDestroy(() => {
		layerList.forEach(({ layerName, sourceName }) => {
			mapboxMap.removeLayer(layerName);
			mapboxMap.removeSource(sourceName);
		});
		mapboxMap = null;
	});
</script>

<div class="h-screen scale-in-center">
	<div class="h-full" id="mapboxMap" />
</div>
