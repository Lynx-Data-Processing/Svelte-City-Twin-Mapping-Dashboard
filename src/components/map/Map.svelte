<script lang="ts">
	import type {
		layerLisElementType,
		selectedPOIType,
		mapDetailsType,
		videoType,
		selectedEventType,
		menuComponentsType
	} from '../../types/types';
	import { GeojsonEnum } from '../../types/enums';
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	import {
		removeObjectWhereValueEqualsString,
		checkIfElementExists
	} from '../../utils/filter-data.js';
	import { buildPopup } from '../../utils/popup/popup-builder';
	import { axiosCacheGetUtility } from '../../utils/fetch-data';
	import { rawKingstonDataToGeojsonData } from '../../utils/geojson/kingston-geojson-util';

	import {
		PUBLIC_MAPBOX_KEY,
		PUBLIC_TREES_URL,
		PUBLIC_OPEN_DATA_KINGSTON_CITY_ZONES_URL
	} from '$env/static/public';

	import { v4 as uuidv4 } from 'uuid';
	import mapboxgl from 'mapbox-gl';
	import MapboxDraw from '@mapbox/mapbox-gl-draw';
	import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
	import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
	import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

	export let isLoading: boolean;
	export let layerList: layerLisElementType[];
	export let selectedPolygon;
	export let videoArray: videoType[];
	export let mapStyle: string;
	export let isReadyForStyleSwitching: boolean = false;
	export let mapDetails: mapDetailsType;
	export let selectedPOI: selectedPOIType | null;
	export let selectedEvent: selectedEventType | null;
	export let gpsData: any;
	export let selectedMenu: menuComponentsType;
	let map: any = null;
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

	const createLayerListElement = (
		layerName: string,
		sourceName: string,
		type: string,
		isShown: boolean,
		faIcon: string,
		hasFilter: boolean,
		data: any
	): layerLisElementType => {
		let tempList = layerList;
		const hasElement = checkIfElementExists(tempList, 'layerName', layerName);
		if (hasElement) {
			tempList = removeObjectWhereValueEqualsString(tempList, 'layerName', layerName);
			if (map.getLayer(layerName)) {
				map.removeLayer(layerName);
				map.removeSource(sourceName);
			}
		}
		//Create the new element and change the layer list
		const element: layerLisElementType = {
			id: uuidv4(),
			icon: faIcon,
			type: type,
			isShown: isShown,
			layerName: layerName,
			hasFilter: hasFilter,
			sourceName: sourceName,
			data: data
		};
		tempList.push(element);
		layerList = tempList;
		return element;
	};

	const fetchDataFromAPIAndCreateLayer = async (
		url: string,
		layerName: string,
		showOnLoad = false,
		dataType = GeojsonEnum.Point,
		dataColor = 'Random',
		dataIcon = 'fa-border-all',
		hasFilter = false
	) => {
		try {
			const response = await axiosCacheGetUtility(url);
			if (response.status === 200) {
				const rawData = response.data.records;

				if (rawData.length) {
					const cleanData = rawKingstonDataToGeojsonData(rawData, layerName, dataType, dataColor);
					createLayerListElement(
						layerName,
						`${layerName}Source`,
						dataType,
						showOnLoad,
						dataIcon,
						hasFilter,
						cleanData
					);
				} else {
					console.log(`No ${layerName} data Exist`);
				}
			} else {
				console.log(`Unable to load data for ${layerName}`);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const fetchInitialMapData = async () => {
		try {
		
			createLayerListElement(
				'3D-Buildings',
				'composite',
				'Other',
				false,
				'fa-building',
				false,
				null
			);

			await fetchDataFromAPIAndCreateLayer(
				PUBLIC_OPEN_DATA_KINGSTON_CITY_ZONES_URL,
				'Neighbourhoods',
				false,
				GeojsonEnum.Polygon,
				'Random',
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
		} catch (err) {
			console.error(err);
		}
	};


	const checkIfMapSourceExists = (sourceName: string) => {
		try {
			const source = map.getSource(sourceName);
			if (source) {
				return true;
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	};

	const addMapSource = (layerListElement: layerLisElementType) => {
		try {
			const sourceExists = checkIfMapSourceExists(layerListElement.sourceName);
			if (sourceExists) {
				map.removeSource(layerListElement.sourceName);
			}
			map.addSource(layerListElement.sourceName, {
				type: 'geojson',
				data: layerListElement.data
			});
		} catch (err) {}
	};

	const addInitialMapDataSources = () => {
		try {
			addTerrainLayer();
			//* Add the additional layers
			layerList.forEach(function (gpsElement) {
				const { layerName, type } = gpsElement;
				//Add the buildings layer
				if (layerName.includes('Buildings')) {
					addBuildingLayer(gpsElement);
				}

				if (type === 'Polygon') {
					addMapSource(gpsElement);
					addPolygonLayer(gpsElement, 0.5, ['get', 'Color']);
				}

				if (type === 'Point') {
					addMapSource(gpsElement);
					addPointLayer(gpsElement, 'Size', ['get', 'Color']);
				}
			});
		} catch (e) {}
	};

	
	const addTerrainLayer = () => {
		map.addSource('mapbox-dem', {
			type: 'raster-dem',
			url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
			tileSize: 512,
			maxzoom: 14
		});
		map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
		// add a sky layer that will show when the map is highly pitched
		map.addLayer({
			id: 'sky',
			type: 'sky',
			paint: {
				'sky-type': 'atmosphere',
				'sky-atmosphere-sun': [0.0, 0.0],
				'sky-atmosphere-sun-intensity': 15
			}
		});
	};
	const addBuildingLayer = (fillList: layerLisElementType, opacity = 1, color = '#dee7e7') => {
		map.addLayer({
			id: fillList.layerName,
			source: fillList.sourceName,
			'source-layer': 'building',
			filter: ['==', 'extrude', 'true'],
			type: 'fill-extrusion',
			minzoom: 15,
			paint: {
				'fill-extrusion-color': color,
				'fill-extrusion-height': [
					'interpolate',
					['linear'],
					['zoom'],
					15,
					0,
					15.05,
					['get', 'height']
				],
				'fill-extrusion-base': [
					'interpolate',
					['linear'],
					['zoom'],
					15,
					0,
					15.05,
					['get', 'min_height']
				],
				'fill-extrusion-opacity': opacity
			}
		});
	};

	const addPolygonLayer = (fillList: layerLisElementType, opacity = 0.5, color = ['red']) => {
		map.addLayer({
			id: fillList.layerName,
			type: 'fill',
			source: fillList.sourceName,
			paint: {
				'fill-color': color,
				'fill-opacity': opacity
			}
		});
		map.setLayoutProperty(fillList.layerName, 'visibility', 'none');
		map.on('click', fillList.layerName, (e: any) => {
			let description = '';
			const sliced = Object.fromEntries(Object.entries(e.features[0].properties).slice(0, 4));
			for (const [key, value] of Object.entries(sliced)) {
				description += `<span class="block ">${key}</span><span class="block">${value}</span>`;
			}
			smallPopup.setLngLat(e.lngLat).setHTML(description).addTo(map);
		});
		// Change the cursor to a pointer when the mouse is over the places layer.
		map.on('mouseenter', fillList.layerName, () => {
			map.getCanvas().style.cursor = 'pointer';
		});
		// Change it back to a pointer when it leaves.
		map.on('mouseleave', fillList.layerName, () => {
			map.getCanvas().style.cursor = '';
		});
	};
	const addLineLayer = (fillList: layerLisElementType, lineWidth = 4, color = ['red']) => {
		map.addLayer({
			id: fillList.layerName,
			type: 'line',
			source: fillList.sourceName,
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			},
			paint: {
				'line-color': color,
				'line-width': lineWidth
			}
		});
		map.on('click', fillList.layerName, (e: any) => {
			let description = '';
			const sliced = Object.fromEntries(Object.entries(e.features[0].properties).slice(0, 4));
			for (const [key, value] of Object.entries(sliced)) {
				description += `<span class="block ">${key}</span><span class="block">${value}</span>`;
			}
			smallPopup.setLngLat(e.lngLat).setHTML(description).addTo(map);
		});
		// Change the cursor to a pointer when the mouse is over the places layer.
		map.on('mouseenter', fillList.layerName, () => {
			map.getCanvas().style.cursor = 'pointer';
		});
		// Change it back to a pointer when it leaves.
		map.on('mouseleave', fillList.layerName, () => {
			map.getCanvas().style.cursor = '';
		});
	};
	const addPointLayer = (
		fillList: layerLisElementType,
		pointSizeName = 'Size',
		color = ['Blue']
	) => {
		try {
			map.addLayer(
				{
					id: fillList.layerName,
					type: 'circle',
					source: fillList.sourceName,
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
			map.setLayoutProperty(fillList.layerName, 'visibility', 'none');
			map.moveLayer(fillList.layerName);
			map.on('click', fillList.layerName, async (e: any) => {
				if (fillList.layerName.includes('GPS')) {
					selectedEvent = { lat: e.lngLat.lat, lng: e.lngLat.lng, data: e.features[0].properties };
					selectedPOI = { lat: e.lngLat.lat, lng: e.lngLat.lng, data: e.features[0].properties };
				} else {
					selectedPOI = { lat: e.lngLat.lat, lng: e.lngLat.lng, data: e.features[0].properties };
				}

				smallPopup
					.setLngLat(e.lngLat)
					.setHTML(
						e?.features
							? await buildPopup(e.features[0], fillList.layerName, videoArray)
							: '<div>Properties do not exist</div>'
					)
					.addTo(map);
			});
			// Change the cursor to a pointer when the mouse is over the places layer.
			map.on('mouseenter', fillList.layerName, () => {
				map.getCanvas().style.cursor = 'pointer';
			});
			// Change it back to a pointer when it leaves.
			map.on('mouseleave', fillList.layerName, () => {
				map.getCanvas().style.cursor = '';
			});
		} catch (err) {
			console.log(err);
		}
	};
	//Update the polygon using the features property
	const updatePolygon = ({}) => {
		try {
			const data = draw.getAll();
			if (data.features.length > 0) {
				selectedPolygon = data.features[0];

				console.log(selectedPolygon);
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
	const addExistingDynamicGPSElements = () => {
		if (map === null || layerList.length <= 0) return;
		try {
			layerList.forEach(function (gpsElement) {
				const dataName = gpsElement.layerName;
				const dataType = gpsElement.type;

				if (dataName !== '3D-Buildings') {
					addMapSource(gpsElement);
					if (dataType === 'Point') {
						addPointLayer(gpsElement, 'Count', ['get', 'Color']);
					}

					if (dataType === 'Polygon') {
						addPolygonLayer(gpsElement, 0.5, ['get', 'Color']);
					}
				}
			});
		} catch (err) {
			console.log(err);
		}
	};
	const addNewDynamicGPSElements = () => {
		if (map === null || gpsData.length <= 0) return;
		try {
			gpsData.forEach(function (rawGpsElement: any) {
				const dataName = rawGpsElement.dataName;
				const dataSourceName = `${dataName}Source`;
				const dataType = rawGpsElement.dataType;
				const dataHasFilter = rawGpsElement.hasFilter;
				let gpsElement: layerLisElementType = createLayerListElement(
					dataName,
					dataSourceName,
					dataType,
					true,
					'fa-road',
					dataHasFilter,
					rawGpsElement
				);
				addMapSource(gpsElement);
				if (dataType === 'Point') {
					addPointLayer(gpsElement, 'Count', ['get', 'Color']);
				}

				if (dataType === 'Polygon') {
					addPolygonLayer(gpsElement, 0.5, ['get', 'Color']);
				}
			});
		} catch (err) {
			console.log(err);
		}
	};
	//Switch the map style only if the map exists and the map is ready for switching styles
	const switchStyle = () => {
		if (map === null || isReadyForStyleSwitching === false) return;
		try {
			map.setStyle('mapbox://styles/mapbox/' + mapStyle);
		} catch (err) {
			console.log(err);
		}
	};

	const addMapFilter = () => {
		// If map not loaded, abort
		if (map === null) return;
		try {
			// If any of the layers are not loaded, abort
			for (let i = 0; i < layerList.length; i += 1) {
				const tempLayerName = layerList[i].layerName;
				const tempLayerIsShown = layerList[i].isShown;
				if (!map.getLayer(tempLayerName)) {
					return;
				}
				if (tempLayerIsShown === true) {
					map.setLayoutProperty(tempLayerName, 'visibility', 'visible');
				} else {
					map.setLayoutProperty(tempLayerName, 'visibility', 'none');
				}
			}
		} catch (err) {
			console.log(err);
			console.log('Unable to add GPS Filters');
		}
	};
	const resizeMap = () => {
		try {
			map.resize();
		} catch (err) {}
	};
	const updateMapCenter = () => {
		if (map === null) return;
		try {
			map.flyTo({
				center: mapDetails.center,
				zoom: mapDetails.zoom
			});
		} catch (err) {
			console.log(err);
		}
	};
	$: map && selectedMenu && resizeMap();
	$: map && mapStyle && isInitialDataLoaded && switchStyle();
	$: map && gpsData && isInitialDataLoaded && addNewDynamicGPSElements();
	$: map && mapDetails && isInitialDataLoaded && updateMapCenter();
	onMount(async () => {
		mapboxgl.accessToken = PUBLIC_MAPBOX_KEY;
		map = new mapboxgl.Map({
			center: mapDetails.center,
			zoom: mapDetails.zoom,
			pitch: mapDetails.pitch,
			bearing: mapDetails.bearing,
			container: 'map',
			antialias: true,
			style: 'mapbox://styles/mapbox/' + mapStyle
		});
		// Get the initial Data
		await fetchInitialMapData();
		map.addControl(draw, 'bottom-left');
		map.addControl(
			new MapboxGeocoder({
				accessToken: mapboxgl.accessToken,
				mapboxgl: mapboxgl
			})
		);
		map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
		map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
		map.on('style.load', function () {
			addInitialMapDataSources();
			if (gpsData) addExistingDynamicGPSElements();
		});
		// Mapboxs normal way to show and hide layers. This calls the filter every second
		map.on('idle', () => {
			addMapFilter();
		});

		map.on('draw.create', updatePolygon);
		map.on('draw.delete', clearPolygon);
		map.on('draw.update', updatePolygon);
		map.on('contextmenu', clearPolygon);

		resizeMap();
	});
	onDestroy(() => {
		try {
			// Remove all the layers and data sources as they are cached and take up a lot of memory
			for (let i = 0; i < layerList.length; i++) {
				map.removeLayer(layerList[i]['layerName']);
				map.removeSource(layerList[i]['sourceName']);
			}
			map = null;
		} catch (e) {}
	});
</script>

<div class="h-96 md:h-screen scale-in-center"><div class="h-full" id="map" /></div>
