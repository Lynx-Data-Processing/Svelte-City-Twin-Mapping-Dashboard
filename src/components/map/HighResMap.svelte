<script>
	import { onMount } from 'svelte';
	import { esriAPIConfig, esriMapConfig } from '../../utils/highResMap/highResMap-utils';

	onMount(async () => {
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
			'esri/layers/ElevationLayer'
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
			ElevationLayer
		) => {

			//* Config esri API key
			esriAPIConfig(esriConfig);
			
			//* Create esri map
			esriMapConfig(
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
				ElevationLayer
			);
		});
	});
</script>

<head>
	<link rel="stylesheet" href="https://js.arcgis.com/4.25/esri/themes/light/main.css" />
	<script src="https://js.arcgis.com/4.25/"></script>
</head>

<div class="h-96 md:h-screen scale-in-center">
	<div class="h-full" id="viewDiv" />
</div>
