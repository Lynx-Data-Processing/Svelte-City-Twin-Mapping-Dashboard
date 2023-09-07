<script lang="ts">
	import { zoomLevelMap, type GeojsonGeometryType, type ILatLngType, type IMapLayer } from "../../types";

    export let layer: IMapLayer;
    export let map: google.maps.Map;

	const updateMapCenter = (
		coordinates: ILatLngType = { lat: 0, lng: 0 },
		dataType: GeojsonGeometryType = 'Point',
		zoomLevel?: number
	) => {
		if (!map) return;
		map.setCenter(coordinates);
		map.setZoom(zoomLevelMap[dataType] || zoomLevel || 15);
		map.setTilt(50);
	};

</script>

<button
	title="Zoom To"
	on:click={() => {
		updateMapCenter(layer.initialCoordinates, layer.type);
	}}
	class="flex flex-row gap-2 w-full h-10 justify-start px-4 bg-zinc-50 hover:bg-zinc-200 "
>
	<i class="fa-solid fa-magnifying-glass-plus my-auto" />
	<p class="my-auto">Zoom To</p>
</button>
