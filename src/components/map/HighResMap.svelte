<script>
	import { onMount } from 'svelte';
	let view;

	onMount(async () => {
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
			const layer = new TileLayer({
				url: 'https://api.cityofkingston.ca/gis_unfed/rest/services/Imagery/Ortho2019/MapServer'
			});

			esriConfig.apiKey =
				'AAPKbea54d6e0f934faf9cb77de8921ba694gZ63JjIx0LPPgLf6SkuldGEniwqC3tZ1nCoDxo7CWtTN0W2oSyhMywv5Sza3VggT';
			const map = new Map({
				ground: {
					layers: [
						new ElevationLayer({
							url: 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer'
						})
					]
				},
				layers: [layer],
				basemap: 'arcgis-navigation'
			});
			view = new SceneView({
				container: 'viewDiv',
				map: map,
				zoom: 10, // scale: 72223.819286

				camera: {
					position: {
						x: -76.491143, //Longitude
						y: 44.231689, //Latitude
						z: 2000 //Meters
					},
					tilt: 40
				}
			});

			const homeBtn = new Home({
				view: view
			});

			const scaleBar = new ScaleBar({
				view: view,
				unit: 'dual'
			});

			const layerList = new LayerList({
				view: view
			});

			const legend = new Legend({
				view: view
			});

			const layerListExpand = new Expand({
				view: view,
				content: layerList,
				expanded: false,
				expandTooltip: 'Expand LayerList'
			});

			const legendExpand = new Expand({
				view: view,
				content: legend,
				expandTooltip: 'Expand Legend',
				expanded: false
			});

			const compass = new Compass({
				view: view,
				visible: false
			});

			view.ui.add(homeBtn, 'top-left');
			view.ui.add(scaleBar, 'bottom-right');
			view.ui.add(layerListExpand, 'top-right');
			view.ui.add(legendExpand, 'bottom-left');
			view.ui.add(compass, 'top-left');

			// load the Compass only when the view is rotated
			view.watch('rotation', function (rotation) {
				if (rotation && !compass.visible) {
					compass.visible = true;
				}
			});
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
