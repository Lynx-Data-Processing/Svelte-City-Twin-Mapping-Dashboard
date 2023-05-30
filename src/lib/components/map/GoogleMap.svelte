<script lang="ts">
    import type { ILayerListElementType } from "$lib/types/mapTypes";
    import type { Data, Map } from "google.maps";
    import { onMount } from "svelte";

    let map: Map | undefined;
    let mapDiv: HTMLDivElement;
    export let layerList: ILayerListElementType[];

    onMount(() => {
        if (!mapDiv) return;

        map = new google.maps.Map(mapDiv, {
            center: { lat: 44.231689, lng: -76.491143 },
            zoom: 18,
            mapTypeId: 'satellite',
            heading: 90,
            tilt: 45,
        });

        layerList.forEach(layer => {
            addGeoJsonLayer(layer.data);
        });
    });

    function addGeoJsonLayer(geoJson: any = null) {
        if (!map) return;
        map.data.addGeoJson(geoJson);
    }

   
</script>

<div class="h-screen relative scale-in-center">
    <div bind:this={mapDiv} class="h-full w-full rounded-lg"></div>
</div>
