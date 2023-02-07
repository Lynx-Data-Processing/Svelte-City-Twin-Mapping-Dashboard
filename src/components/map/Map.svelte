<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { GeojsonEnum } from '../../types/enums';
	import type {
		geojsonType,
		layerListElementType,
		mapDetailsType,
		menuComponentsType,
		selectedPOIType,
		videoType
	} from '../../types/types';
	import { axiosCacheGetUtility } from '../../utils/fetch-data';

	import { rawKingstonDataToGeojsonData } from '../../utils/geojson/kingston-geojson-util';
	import { buildPopup } from '../../utils/popup/popup-builder';

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
	import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
	import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
	import mapboxgl from 'mapbox-gl';

	import {
		addMapSource,
		checkIfElementExistsAndRemove,
		checkIfMapLayerExists,
		createLayerListElement
	} from '../../utils/map/map-utils';

	// ------------------ Mapbox ------------------
	export let layerList: layerListElementType[];
	export let selectedPolygon = null;
	export let videoArray: videoType[];
	export let mapStyle: string;
	export let mapDetails: mapDetailsType;
	export let selectedPOI: selectedPOIType | null;
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

	const addLayerListElement = (layerListElement: layerListElementType): layerListElementType => {
		let tempLayerList = layerList;
		tempLayerList = checkIfElementExistsAndRemove(tempLayerList, layerListElement.layerName, map);
		tempLayerList.push(layerListElement);
		layerList = tempLayerList;
		return layerListElement;
	};

	const fetchDataFromAPIAndCreateLayer = async (
		url: string,
		layerName: string,
		showOnLoad = false,
		dataType = GeojsonEnum.Point,
		dataColor = 'White',
		dataIcon = 'fa-border-all',
		hasFilter = false
	) => {
		try {
			const response = await axiosCacheGetUtility(url);
			if (response.status === 200) {
				const rawData = response.data.records;
				if (!rawData.length) return;

				const cleanData = rawKingstonDataToGeojsonData(rawData, layerName, dataType, dataColor);

				const layerLisElement: layerListElementType = createLayerListElement(
					layerName,
					`${layerName}Source`,
					dataType,
					showOnLoad,
					dataIcon,
					hasFilter,
					dataColor,
					cleanData
				);
				addLayerListElement(layerLisElement);
			} else {
				console.log(`Unable to load data for ${layerName}`);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const fetchInitialMapData = async () => {
		const buildingLayerListElement: layerListElementType = createLayerListElement(
			'3D-Buildings',
			'composite',
			GeojsonEnum.Feature,
			false,
			'fa-building',
			false,
			'Black',
			null
		);
		addLayerListElement(buildingLayerListElement);

		await fetchDataFromAPIAndCreateLayer(
			PUBLIC_OPEN_DATA_KINGSTON_CITY_ZONES_URL,
			'Neighborhoods',
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

		await fetchDataFromAPIAndCreateLayer(
			PUBLIC_PLANNING_POINT_URL,
			'Road Construction (Point)',
			true,
			GeojsonEnum.Point,
			'#7B48FF',
			'fa-road',
			false
		);

		await fetchDataFromAPIAndCreateLayer(
			PUBLIC_SIDEWALK_POLYGON_URL,
			'Sidewalk Construction (Polygon)',
			true,
			GeojsonEnum.Polygon,
			'#F5B514',
			'fa-person',
			false
		);

		await fetchDataFromAPIAndCreateLayer(
			PUBLIC_PLANNING_LINE_URL,
			'Road Construction (Line)',
			true,
			GeojsonEnum.LineString,
			'#16C97B',
			'fa-road',
			false
		);

		isInitialDataLoaded = true;
	};

	// ------------------ Mapbox Map adding Layers ------------------ //
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
	const addBuildingLayer = (layerElement: layerListElementType, opacity = 1, color = '#dee7e7') => {
		map.addLayer({
			id: layerElement.layerName,
			source: layerElement.sourceName,
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

	const addPolygonLayer = (layerElement: layerListElementType, opacity = 0.5, color = ['red']) => {
		map.addLayer({
			id: layerElement.layerName,
			type: 'fill',
			source: layerElement.sourceName,
			paint: {
				'fill-color': color,
				'fill-opacity': opacity
			}
		});
		map.setLayoutProperty(layerElement.layerName, 'visibility', 'none');
		map.on('click', layerElement.layerName, (e: any) => {
			let description = '';
			const sliced = Object.fromEntries(Object.entries(e.features[0].properties).slice(0, 4));
			for (const [key, value] of Object.entries(sliced)) {
				description += `<span class="block font-bold">${key}</span><span class="block">${value}</span>`;
			}
			smallPopup.setLngLat(e.lngLat).setHTML(description).addTo(map);
		});
		// Change the cursor to a pointer when the mouse is over the places layer.
		map.on('mouseenter', layerElement.layerName, () => {
			map.getCanvas().style.cursor = 'pointer';
		});
		// Change it back to a pointer when it leaves.
		map.on('mouseleave', layerElement.layerName, () => {
			map.getCanvas().style.cursor = '';
		});
	};
	const addLineLayer = (layerElement: layerListElementType, lineWidth = 4, color = ['red']) => {
		try {
			map.addLayer({
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
			map.on('click', layerElement.layerName, (e: any) => {
				let description = '';
				const sliced = Object.fromEntries(Object.entries(e.features[0].properties).slice(0, 4));
				for (const [key, value] of Object.entries(sliced)) {
					description += `<span class="block font-bold">${key}</span><span class="block">${value}</span>`;
				}
				smallPopup.setLngLat(e.lngLat).setHTML(description).addTo(map);
			});
			// Change the cursor to a pointer when the mouse is over the places layer.
			map.on('mouseenter', layerElement.layerName, () => {
				map.getCanvas().style.cursor = 'pointer';
			});
			// Change it back to a pointer when it leaves.
			map.on('mouseleave', layerElement.layerName, () => {
				map.getCanvas().style.cursor = '';
			});
		} catch (e) {
			console.log(e);
		}
	};
	const addPointLayer = (
		layerElement: layerListElementType,
		pointSizeName = 'Size',
		color = ['Blue']
	) => {
		try {
			map.addLayer(
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
			map.setLayoutProperty(layerElement.layerName, 'visibility', 'none');
			map.moveLayer(layerElement.layerName);
			map.on('click', layerElement.layerName, async (e: any) => {
				selectedPOI = { lat: e.lngLat.lat, lng: e.lngLat.lng, data: e.features[0].properties };

				smallPopup
					.setLngLat(e.lngLat)
					.setHTML(
						e?.features
							? await buildPopup(e.features[0], layerElement.layerName, videoArray)
							: '<div>Properties do not exist</div>'
					)
					.addTo(map);
			});
			// Change the cursor to a pointer when the mouse is over the places layer.
			map.on('mouseenter', layerElement.layerName, () => {
				map.getCanvas().style.cursor = 'pointer';
			});
			// Change it back to a pointer when it leaves.
			map.on('mouseleave', layerElement.layerName, () => {
				map.getCanvas().style.cursor = '';
			});
		} catch (err) {
			console.log(err);
		}
	};
	// ------------------ Map Layer functions ------------------ //

	// ------------------ Map Layer functions ------------------ //
	const addLayerListElementSourceAndLayer = (layerListElement: layerListElementType) => {
		const { layerName, type } = layerListElement;

		const doesLayerExist = checkIfMapLayerExists(layerListElement.layerName, map);
		if (doesLayerExist) map.removeLayer(layerListElement.layerName);

		//Add the buildings layer
		if (layerName.includes('Buildings')) {
			addBuildingLayer(layerListElement);
		}

		if (type === GeojsonEnum.Polygon) {
			addMapSource(layerListElement, map);
			addPolygonLayer(layerListElement, 0.5, ['get', 'Color']);
		}

		if (type === GeojsonEnum.Point) {
			addMapSource(layerListElement, map);
			addPointLayer(layerListElement, 'Size', ['get', 'Color']);
		}

		if (type === GeojsonEnum.LineString) {
			addMapSource(layerListElement, map);
			addLineLayer(layerListElement, 8, ['get', 'Color']);
		}
	};

	const addExistingDynamicGPSElements = () => {
		if (map === null || layerList.length <= 0) return;

		try {
			addTerrainLayer();
			//* Add the additional layers
			layerList.forEach(function (layerLisElement) {
				addLayerListElementSourceAndLayer(layerLisElement);
			});

			isInitialDataLoaded = true;
		} catch (e) {}
	};

	const addNewDynamicGPSElements = () => {
		if (map === null || gpsData.length <= 0) return;

		gpsData.forEach((rawGpsElement: geojsonType) => {
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
			addLayerListElement(layerLisElement);

			addLayerListElementSourceAndLayer(layerLisElement);
		});
	};
	// ------------------ Map Layer functions ------------------ //

	// ------------------ Map Style functions ------------------ //
	const switchStyle = () => {
		if (map === null || isInitialDataLoaded === false) return;
		try {
			map.setStyle('mapbox://styles/mapbox/' + mapStyle);
		} catch (err) {
			console.log(err);
		}
	};

	const addMapLayerVisibility = () => {
		// If map not loaded or layers not loaded, return
		if (map === null || !layerList.every((layer) => map.getLayer(layer.layerName))) {
			return;
		}

		try {
			// Set layer visibility based on isShown flag
			layerList.forEach((layer) => {
				map.setLayoutProperty(layer.layerName, 'visibility', layer.isShown ? 'visible' : 'none');
			});
		} catch (error) {
			console.error(error);
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

	$: map && selectedMenu && resizeMap();
	$: map && mapStyle && switchStyle();
	$: map && gpsData && addNewDynamicGPSElements();
	$: map && mapDetails && updateMapCenter();
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
			addExistingDynamicGPSElements();
			if (gpsData) addExistingDynamicGPSElements();
		});
		// Mapboxs normal way to show and hide layers. This calls the filter every second
		map.on('idle', () => {
			addMapLayerVisibility();
			resizeMap();
		});

		map.on('draw.create', updatePolygon);
		map.on('draw.delete', clearPolygon);
		map.on('draw.update', updatePolygon);
		map.on('contextmenu', clearPolygon);
	});
	onDestroy(() => {
		try {
			layerList.forEach(({ layerName, sourceName }) => {
				map.removeLayer(layerName);
				map.removeSource(sourceName);
			});
			map = null;
		} catch (e) {}
	});
</script>

<div class="h-96 md:h-screen scale-in-center rounded-lg">
	<div class="h-full rounded-lg" id="map" />
</div>
