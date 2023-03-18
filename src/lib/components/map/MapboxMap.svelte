<script lang="ts">
	import { GeojsonEnum } from '$lib/types/enums';
	import type { ISelectedPOIType, IVideoType } from '$lib/types/eventTypes';
	import type { IGeojsonType } from '$lib/types/geosjonTypes';
	import type { ILayerListElementType, IMapDetailsType } from '$lib/types/mapTypes';
	import type { IMenuComponentsType } from '$lib/types/types';
	import { onDestroy, onMount } from 'svelte';

	import { axiosCacheGetUtility } from '$lib/utils/fetch-data';
	import { rawKingstonDataToGeojsonData } from '$lib/utils/geojson/kingston-geojson-util';
	import { buildPopup } from '$lib/utils/popup-builder';

	import {
		PUBLIC_MAPBOX_KEY,
		PUBLIC_OPEN_DATA_KINGSTON_CITY_ZONES_URL,
		PUBLIC_PLANNING_LINE_URL,
		PUBLIC_PLANNING_POINT_URL,
		PUBLIC_SIDEWALK_POLYGON_URL,
		PUBLIC_TREES_URL
	} from '$env/static/public';

	import MapboxDraw from '@mapbox/mapbox-gl-draw';
	import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

	import mapboxgl from 'mapbox-gl';

	import {
		addMapSource,
		createLayerListElement
	} from '$lib/utils/mapboxMap/mapboxMap-utils';

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
	export let selectedPOI: ISelectedPOIType | null;
	export let selectedMenu: IMenuComponentsType | null;
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

	const removeLayerAndSource = (layerName: string, sourceName: string) => {
		if (mapboxMap.getLayer(layerName)) {
			mapboxMap.removeLayer(layerName);
		}

		if (mapboxMap.getSource(sourceName)) {
			mapboxMap.removeSource(sourceName);
		}
	};

	const addLayerListElementToLayerList = (layerListElement: ILayerListElementType): ILayerListElementType => {
		let tempLayerList = layerList;
		const hasElement = checkIfElementExists(tempLayerList, 'layerName', layerListElement.layerName);
		if (hasElement) {
			tempLayerList = removeObjectWhereValueEqualsString(tempLayerList, 'layerName', layerListElement.layerName);
		}
		tempLayerList.push(layerListElement);
		layerList = tempLayerList;
		return layerListElement;
	};

	const fetchDataFromAPIAndCreateLayer = async (
		url: string,
		layerName: string,
		showOnLoad = false,
		dataType = GeojsonEnum.Point,
		dataColor: string | null = null,
		dataIcon = 'fa-border-all',
		hasFilter = false
	) => {
		try {
			const response = await axiosCacheGetUtility(url);
			if (response.status === 200) {
				const rawData = response.data.records;
				if (!rawData.length) return;

				const cleanData = rawKingstonDataToGeojsonData(rawData, layerName, dataType, dataColor);

				const layerLisElement: ILayerListElementType = createLayerListElement(
					layerName,
					`${layerName}Source`,
					dataType,
					showOnLoad,
					dataIcon,
					hasFilter,
					dataColor,
					cleanData
				);
				removeLayerAndSource(layerLisElement.layerName, layerLisElement.sourceName);
				addLayerListElementToLayerList(layerLisElement);
			} else {
				console.log(`Unable to load data for ${layerName}`);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const fetchInitialMapData = async () => {
		const buildingLayerListElement: ILayerListElementType = createLayerListElement(
			'3D-Buildings',
			'composite',
			GeojsonEnum.Feature,
			true,
			'fa-building',
			false,
			'Black',
			null
		);
		addLayerListElementToLayerList(buildingLayerListElement);

		await fetchDataFromAPIAndCreateLayer(
			PUBLIC_OPEN_DATA_KINGSTON_CITY_ZONES_URL,
			'Neighborhoods',
			false,
			GeojsonEnum.Polygon,
			null,
			'fa-border-all',
			false
		);
		await fetchDataFromAPIAndCreateLayer(
			PUBLIC_TREES_URL,
			'Trees',
			true,
			GeojsonEnum.Point,
			'Green',
			'fa-border-all',
			false
		);

		await fetchDataFromAPIAndCreateLayer(
			PUBLIC_PLANNING_POINT_URL,
			'Road Construction (Point)',
			false,
			GeojsonEnum.Point,
			'#7B48FF',
			'fa-road',
			false
		);
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
					'line-width': lineWidth
				}
			});

			mapboxMap.on('click', layerElement.layerName, async (e: any) => {
				selectedPOI = { lat: e.lngLat.lat, lng: e.lngLat.lng, data: e.features[0].properties };

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
				selectedPOI = { lat: e.lngLat.lat, lng: e.lngLat.lng, data: e.features[0].properties };

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
	const addLayerListElementSourceAndLayer = (layerListElement: ILayerListElementType) => {
	
		//Add the buildings layer
		if (layerListElement.layerName.includes('Buildings')) {
			addBuildingLayer(mapboxMap, layerListElement);
		}

		if (layerListElement.type === GeojsonEnum.Polygon) {
			addMapSource(layerListElement, mapboxMap);
			addPolygonLayer(mapboxMap, smallPopup, layerListElement, 0.5, ['get', 'Color']);
		}

		if (layerListElement.type === GeojsonEnum.Point) {
			addMapSource(layerListElement, mapboxMap);
			addPointLayer(mapboxMap, smallPopup, layerListElement, 'Size', ['get', 'Color']);
		}

		if (layerListElement.type === GeojsonEnum.LineString) {
			addMapSource(layerListElement, mapboxMap);
			addLineLayer(mapboxMap, smallPopup, layerListElement, 8, ['get', 'Color']);
		}
	};

	const addExistingDynamicGPSElements = () => {
		if (!mapboxMap || !layerList.length) return;

		try {
			addTerrainLayer(mapboxMap);
			layerList.forEach(function (layerLisElement) {
				addLayerListElementSourceAndLayer(layerLisElement);
			});

			isInitialDataLoaded = true;
		} catch (e) {}
	};

	const addNewDynamicGPSElements = () => {
		if (!mapboxMap || !gpsData.length) return;

		gpsData.forEach((rawGpsElement: IGeojsonType) => {
			const { dataName, dataType, hasFilter } = rawGpsElement;
			const dataSourceName = `${dataName}Source`;

			const layerLisElement = createLayerListElement(
				dataName,
				dataSourceName,
				dataType,
				true,
				'fa-road',
				hasFilter,
				'Random',
				rawGpsElement
			);
			removeLayerAndSource(layerLisElement.layerName, layerLisElement.sourceName)
			addLayerListElementToLayerList(layerLisElement);

			addLayerListElementSourceAndLayer(layerLisElement);
		});
	};
	// ------------------ Map Layer functions ------------------ //

	// ------------------ Map Style functions ------------------ //
	const switchStyle = () => {
		if (!mapboxMap || !isInitialDataLoaded) return;
		mapboxMap.setStyle(mapStyle);
	};

	const addMapLayerVisibility = () => {
		if (!mapboxMap || !layerList) return;

		try {
			layerList.forEach((layer) => {
				mapboxMap.setLayoutProperty(
					layer.layerName,
					'visibility',
					layer.isShown ? 'visible' : 'none'
				);
			});
		} catch (error) {
			console.error(error);
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
		// Mapboxs normal way to show and hide layers. This calls the filter every second
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
