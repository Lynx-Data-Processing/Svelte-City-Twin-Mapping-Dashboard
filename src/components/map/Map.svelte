<script>
// @ts-nocheck

	import { onMount } from "svelte";
	import { onDestroy } from "svelte";
	import { getObjectsWhereKeyEqualsValue, removeObjectWhereValueEqualsString, checkIfElementExists } from "../../utils/filter-data.js";
	import { buildPopup } from "../../utils/popup/popup-builder";
	import { axiosGetUtility, axiosCacheGetUtility } from "../../utils/fetch-data";
	import { rawKingstonGPSDataToGeojsonNeighbourhoods, rawKingstonTreeDataToGeojsonTrees } from "../../utils/geojson/kingston-geojson-util";

	import {  PUBLIC_MAPBOX_KEY, PUBLIC_TREES_URL , PUBLIC_OPEN_DATA_KINGSTON_CITY_ZONES_URL} from '$env/static/public'
	
	import { v4 as uuidv4 } from "uuid";
	import mapboxgl from 'mapbox-gl';
	import MapboxDraw from "@mapbox/mapbox-gl-draw";
	import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

	export let isLoading;
	export let layerList;
	export let selectedPolygon;
	export let mapStyle;
	export let isReadyForStyleSwitching;
	export let mapDetails;
	export let pointOfInterest;
	export let gpsData;
	export let gpsFilters;
	export let devicesArray;
	export let selectedMenu;
	let map = null;
	let isInitialDataLoaded = false;
	const smallPopup = new mapboxgl.Popup();
	const draw = new MapboxDraw({
		displayControlsDefault: false,
		controls: {
			polygon: true,
			trash: true,
		},
		defaultMode: "simple_select",
	});

	const createLayerListElement = (layerName, sourceName, type, isShown, faIcon, hasFilter, data) => {
		try {
			let tempList = layerList;
			const hasElement = checkIfElementExists(tempList, "layerName", layerName);
			if (hasElement) {
				tempList = removeObjectWhereValueEqualsString(tempList, "layerName", layerName);
				if (map.getLayer(layerName)) {
					map.removeLayer(layerName);
					map.removeSource(sourceName);
				}
			}
			//Create the new element and change the layer list
			const element = { id: uuidv4(), icon: faIcon, type: type, isShown: isShown, layerName: layerName, hasFilter: hasFilter, sourceName: sourceName, data: data };
			tempList.push(element);
			layerList = tempList;
			return element;
		} catch (err) {
			console.error(err);
			alert("Unable to create Layer Element");
		}
	};
	const fetchInitialMapData = async () => {
		try {
			//* 3D bultings layer element
			createLayerListElement("3D-Buildings", "composite", "Polygon", false,  "fa-building",  false ,  null);

			// Neighbourhoods (Zones) data
			const response = await axiosCacheGetUtility(PUBLIC_OPEN_DATA_KINGSTON_CITY_ZONES_URL);
			if (response.status === 200) {
				const rawNeighbourhoodsData = response.data.records;
				if (rawNeighbourhoodsData.length >= 1) {
					const neighbourhoodsData = rawKingstonGPSDataToGeojsonNeighbourhoods(rawNeighbourhoodsData);
					createLayerListElement(
						"Neighbourhoods",
						"NeighbourhoodsSource",
						"Polygon",
						false,
						"fa-border-all",
						false,
						neighbourhoodsData
					);
					
				} else {
					alert("No City Neighbourhoods data Exist");
				}
			} else {
				alert("Unable to load City Neighbourhoods data");
			}
			const treeResponse = await axiosCacheGetUtility(PUBLIC_TREES_URL);
			if (treeResponse.status === 200) {
				const rawTreesData = treeResponse.data.records;

				if (rawTreesData.length >= 1) {
					const treesData = rawKingstonTreeDataToGeojsonTrees(rawTreesData);
					createLayerListElement("Trees", "TreesSource", "Point", true,  "fa-border-all", false,  treesData);
				
				} else {
					alert("No City Trees data Exist");
				}
			} else {
				alert("Unable to load City Trees data");
			}
		} catch (err) {
			console.error(err);
			alert("Unable to fetch initial Map Data");
		}

		addDataSources();
	};
	const addMapSource = (layerListElement) => {
		try {
			map.addSource(layerListElement.sourceName, {
				type: "geojson",
				data: layerListElement.data,
			});
		} catch (err) {
			console.error(err);
			alert("Unable to fetch initial Map Data");
		}
	};
	const addDataSources = () => {
		try {
			addTerrainLayer();
			//* Add the additional layers
			layerList.forEach(function (gpsElement) {
				const dataName = gpsElement.layerName;
				const dataType = gpsElement.type;

				//Add the buildings layer
				if (dataName.includes("Buildings")) {
					addBuildingLayer(gpsElement);
				}

				//* If the layer is neighbourhoods and does not include outline
				if (dataName.includes("Neighbourhoods")) {
					addMapSource(gpsElement);
					if (dataType === "Polygon") {
						addNeighbourhoodsLayer(gpsElement, ["get", "Color"]);
					}
				}

				//* If the layer is neighbourhoods and does not include outline
				if (dataName.includes("Trees")) {
					addMapSource(gpsElement);
					if (dataType === "Point") {
						addPointLayer(gpsElement, "Trunk_Diameter", ["get", "Color"]);
					}
				}
			});

			isInitialDataLoaded = true;
			isLoading = false;
		} catch (e) {
			
		}
	};
	const addTerrainLayer = () => {
		map.addSource("mapbox-dem", {
			type: "raster-dem",
			url: "mapbox://mapbox.mapbox-terrain-dem-v1",
			tileSize: 512,
			maxzoom: 14,
		});
		map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
		// add a sky layer that will show when the map is highly pitched
		map.addLayer({
			id: "sky",
			type: "sky",
			paint: {
				"sky-type": "atmosphere",
				"sky-atmosphere-sun": [0.0, 0.0],
				"sky-atmosphere-sun-intensity": 15,
			},
		});
	};
	const addBuildingLayer = (fillList, opacity = 1, color = "#dee7e7") => {
		map.addLayer({
			id: fillList.layerName,
			source: fillList.sourceName,
			"source-layer": "building",
			filter: ["==", "extrude", "true"],
			type: "fill-extrusion",
			minzoom: 15,
			paint: {
				"fill-extrusion-color": color,
				"fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "height"]],
				"fill-extrusion-base": ["interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "min_height"]],
				"fill-extrusion-opacity": opacity,
			},
		});
	};

	//* This polygon layer is used for city zones.
	//* It is special because each layer changes opacity when the user hovers over the gps polygon
	const addNeighbourhoodsLayer = (fillList, color = "blue") => {
		try {
			map.addLayer({
				id: fillList.layerName,
				type: "fill",
				source: fillList.sourceName,
				layout: {},
				paint: {
					"fill-color": color,
					"fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 1, 0.5],
				},
			});
			map.setLayoutProperty(fillList.layerName, "visibility", "none");
			let hoveredStateId = null;
			map.on("mousemove", fillList.layerName, (e) => {
				if (e.features.length > 0) {
					if (hoveredStateId !== null) {
						map.setFeatureState({ source: fillList.sourceName, id: hoveredStateId }, { hover: false });
					}
					hoveredStateId = e.features[0].id;
					map.setFeatureState({ source: fillList.sourceName, id: hoveredStateId }, { hover: true });
				}
			});

			map.on("mouseleave", fillList.layerName, () => {
				if (hoveredStateId !== null) {
					map.setFeatureState({ source: fillList.sourceName, id: hoveredStateId }, { hover: false });
				}
				hoveredStateId = null;
			});
		} catch (err) {
			console.log(err);
		}
	};
	const addPolygonLayer = (fillList, opacity = 0.5, color = "red") => {
		map.addLayer({
			id: fillList.layerName,
			type: "fill",
			source: fillList.sourceName,
			paint: {
				"fill-color": color,
				"fill-opacity": opacity,
			},
		});
		map.setLayoutProperty(fillList.layerName, "visibility", "none");
		map.on("click", fillList.layerName, (e) => {
			let description = "";
			const sliced = Object.fromEntries(Object.entries(e.features[0].properties).slice(0, 4));
			for (const [key, value] of Object.entries(sliced)) {
				description += `<span class="block ">${key}</span><span class="block">${value}</span>`;
			}
			smallPopup.setLngLat(e.lngLat).setHTML(description).addTo(map);
		});
		// Change the cursor to a pointer when the mouse is over the places layer.
		map.on("mouseenter", fillList.layerName, () => {
			map.getCanvas().style.cursor = "pointer";
		});
		// Change it back to a pointer when it leaves.
		map.on("mouseleave", fillList.layerName, () => {
			map.getCanvas().style.cursor = "";
		});
	};
	const addLineLayer = (fillList, lineWidth = 4, color = "red") => {
		map.addLayer({
			id: fillList.layerName,
			type: "line",
			source: fillList.sourceName,
			layout: {
				"line-join": "round",
				"line-cap": "round",
			},
			paint: {
				"line-color": color,
				"line-width": lineWidth,
			},
		});
		map.on("click", fillList.layerName, (e) => {
			let description = "";
			const sliced = Object.fromEntries(Object.entries(e.features[0].properties).slice(0, 4));
			for (const [key, value] of Object.entries(sliced)) {
				description += `<span class="block ">${key}</span><span class="block">${value}</span>`;
			}
			smallPopup.setLngLat(e.lngLat).setHTML(description).addTo(map);
		});
		// Change the cursor to a pointer when the mouse is over the places layer.
		map.on("mouseenter", fillList.layerName, () => {
			map.getCanvas().style.cursor = "pointer";
		});
		// Change it back to a pointer when it leaves.
		map.on("mouseleave", fillList.layerName, () => {
			map.getCanvas().style.cursor = "";
		});
	};
	const addPointLayer = (fillList, pointSizeName = "Size", color = "blue") => {
		try {
			map.addLayer(
				{
					id: fillList.layerName,
					type: "circle",
					source: fillList.sourceName,
					minzoom: 12,
					paint: {
						"circle-radius": [
							"interpolate",
							["linear"],
							["zoom"],
							7,
							["interpolate", ["linear"], ["get", pointSizeName], 1, 2, 3, 4],
							16,
							["interpolate", ["linear"], ["get", pointSizeName], 3, 6, 9, 12],
						],
						"circle-color": color,
					},
				},
				"waterway-label"
			);
			map.setLayoutProperty(fillList.layerName, "visibility", "none");
			map.moveLayer(fillList.layerName);
			map.on("click", fillList.layerName, async (e) => {
				pointOfInterest = { lat: e.lngLat.lat, lng: e.lngLat.lng, deviceId: e.features[0].properties.deviceId };
				smallPopup
					.setLngLat(e.lngLat)
					.setHTML(e?.features ? await buildPopup(e.features[0], fillList.layerName, devicesArray) : "<div>Properties do not exist</div>")
					.addTo(map);
			});
			// Change the cursor to a pointer when the mouse is over the places layer.
			map.on("mouseenter", fillList.layerName, () => {
				map.getCanvas().style.cursor = "pointer";
			});
			// Change it back to a pointer when it leaves.
			map.on("mouseleave", fillList.layerName, () => {
				map.getCanvas().style.cursor = "";
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
		if (map === null || gpsData.length <= 0) return;
		try {
			layerList.forEach(function (gpsElement) {
				const dataName = gpsElement.layerName;
				const dataType = gpsElement.type;
				if (dataName.includes("GPS")) {
					addMapSource(gpsElement);
					if (dataType === "Point") {
						addPointLayer(gpsElement, "Size", ["get", "Color"]);
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
			gpsData.forEach(function (rawGpsElement) {
				const dataName = rawGpsElement.dataName;
				const dataSourceName = `${dataName}Source`;
				const dataType = rawGpsElement.dataType;
				const dataHasFilter = rawGpsElement.hasFilter;
				let gpsElement = createLayerListElement(
					dataName,
					dataSourceName,
					dataType,
					true,
					"fa-road",
					dataHasFilter,
					rawGpsElement
				);
				addMapSource(gpsElement);
				if (dataType === "Point") {
					addPointLayer(gpsElement, "Size", ["get", "Color"]);
				}
			});
			clearPolygon();
		} catch (err) {
			console.log(err);
		}
	};
	//Switch the map style only if the map exists and the map is ready for switching styles
	const switchStyle = () => {
		if (map === null || isReadyForStyleSwitching === false) return;
		try {
			map.setStyle("mapbox://styles/mapbox/" + mapStyle);
		} catch (err) {
			console.log(err);
		}
	};
	const createFilterArray = () => {
		if (map === null || gpsData.length <= 0) return;
		let filterArray = ["all"];
		for (let i = 0; i < gpsFilters.length; i++) {
			let id = gpsFilters[i].id;
			let min = gpsFilters[i].selected[0];
			let max = gpsFilters[i].selected[1];
			let minArray = [">=", ["get", id], min];
			let maxArray = ["<=", ["get", id], max];
			filterArray.push(minArray);
			filterArray.push(maxArray);
		}
		return filterArray;
	};
	//GPS Filter shows and hides points on the map if the values change.
	//To add another filter use >, <, = and the value
	const addMapGPSFilters = () => {
		if (map === null || gpsData.length <= 0) return;
		try {
			let filterArray = createFilterArray();
			layerList.forEach(function (gpsElement) {
				const dataName = gpsElement.layerName;
				const hasFilter = gpsElement.hasFilter;

				if (dataName.includes("GPS") && hasFilter) {
					map.setFilter(dataName, filterArray);
				}
			});
		} catch (err) {
			console.log(err);
			alert("Unable to add GPS Filters");
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
					map.setLayoutProperty(tempLayerName, "visibility", "visible");
				} else {
					map.setLayoutProperty(tempLayerName, "visibility", "none");
				}
			}
		} catch (err) {
			console.log(err);
			alert("Unable to add GPS Filters");
		}
	};
	const resizeMap = () => {
		try {
			map.resize();
		} catch (err) {
			
		}
	};
	const updateMapCenter = () => {
		if (map === null) return;
		try {
			map.flyTo({
				center: mapDetails.center,
				zoom: mapDetails.zoom,
			});
		} catch (err) {
			console.log(err);
			alert("Unable to resize the Map");
		}
	};
	$: map && selectedMenu !== null && resizeMap();
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
			container: "map",
			antialias: true,
			style: "mapbox://styles/mapbox/" + mapStyle,
		});
		// Get the initial Data
		await fetchInitialMapData();
		map.addControl(draw, "bottom-left");
		map.addControl(
			new MapboxGeocoder({
				accessToken: mapboxgl.accessToken,
				mapboxgl: mapboxgl,
			})
		);
		map.addControl(new mapboxgl.FullscreenControl(), "bottom-right");
		map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
		map.on("style.load", function () {
			addDataSources();
			if (gpsData) addExistingDynamicGPSElements();
		});
		// Mapboxs normal way to show and hide layers. This calls the filter every second
		map.on("idle", () => {
			addMapFilter();
			if (gpsData) addMapGPSFilters();
		});
		const interval = setInterval(function () {
			resizeMap();
		}, 500);
		map.on("draw.create", updatePolygon);
		map.on("draw.delete", clearPolygon);
		map.on("draw.update", updatePolygon);
		map.on("contextmenu", clearPolygon);
	});
	onDestroy(() => {
		try {
			// Remove all the layers and data sources as they are cached and take up a lot of memory
			for (let i = 0; i < layerList.length; i++) {
				map.removeLayer(layerList[i]["layerName"]);
				map.removeSource(layerList[i]["sourceName"]);
			}
			map = null;
		} catch (e) {}
	});
</script>

<div class="h-96 md:h-screen scale-in-center"><div class="h-full rounded-lg" id="map" /></div>
