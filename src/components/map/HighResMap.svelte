<script>
	import { GeojsonEnum } from '$lib/types/enums';
	import { onMount } from 'svelte';
	import { axiosCacheGetUtility } from '../../utils/fetch-data';
	import {
		addFeatureLayer,
		addTileLayer,
		createBaseMapToggle,
		createMapAndSceneView,
		createMapWidgets,
		esriAPIConfig
	} from '../../utils/highResMap/highResMap-utils';

	import {
		PUBLIC_MAPBOX_KEY,
		PUBLIC_OPEN_DATA_KINGSTON_CITY_ZONES_URL,
		PUBLIC_PLANNING_LINE_URL,
		PUBLIC_PLANNING_POINT_URL,
		PUBLIC_SIDEWALK_POLYGON_URL,
		PUBLIC_TREES_URL
	} from '$env/static/public';

	let view;
	let map;

	const createESRIMap = async () => {
		// Load the modules for the ArcGIS API for JavaScript
		// They cannot be loaded using ES modules because they are in common JS format and conflict with VITE
		require([
			'esri/config',
			'esri/Map',
			'esri/views/MapView',
			'esri/widgets/Home',
			'esri/widgets/ScaleBar',
			'esri/widgets/LayerList',
			'esri/widgets/Legend',
			'esri/widgets/Expand',
			'esri/widgets/Compass',
			'esri/layers/TileLayer',
			'esri/views/SceneView',
			'esri/layers/FeatureLayer',
			'esri/layers/ElevationLayer',
			'esri/widgets/BasemapToggle',
			'esri/widgets/BasemapGallery'
		], (
			esriConfig,
			Map,
			MapView,
			Home,
			ScaleBar,
			LayerList,
			Legend,
			Expand,
			Compass,
			TileLayer,
			SceneView,
			FeatureLayer,
			ElevationLayer,
			BasemapToggle,
			BasemapGallery
		) => {
			//* Config esri API key
			esriAPIConfig(esriConfig);
			[map, view] = createMapAndSceneView(Map, SceneView, ElevationLayer, TileLayer);
			createMapWidgets(view, Home, ScaleBar, LayerList, Legend, Expand, Compass);
			createBaseMapToggle(view, BasemapToggle, BasemapGallery);
			addFeatureLayer(
				map,
				FeatureLayer,
				'https://services1.arcgis.com/5GRYvurYYUwAecLQ/arcgis/rest/services/Waste_Collection_Area/FeatureServer'
			);

			addFeatureLayer(
				map,
				FeatureLayer,
				'https://services1.arcgis.com/5GRYvurYYUwAecLQ/ArcGIS/rest/services/Trees1/FeatureServer'
			);
		});
	};

	onMount(async () => {
		createESRIMap();
	});
</script>

<head>
	<link rel="stylesheet" href="https://js.arcgis.com/4.25/esri/themes/light/main.css" />
	<script src="https://js.arcgis.com/4.25/"></script>
</head>

<div class="h-96 md:h-screen scale-in-center">
	<div class="h-full" id="viewDiv" />
</div>
