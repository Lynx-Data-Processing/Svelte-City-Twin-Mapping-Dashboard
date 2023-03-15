import type { layerListElementType } from '$lib/types/mapTypes';


export const addTerrainLayer = (map: any) => {
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

    map.setFog({
        color: 'rgb(186, 210, 235)', // Lower atmosphere
        'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
        'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
        'space-color': 'rgb(11, 11, 25)', // Background color
        'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
    });
};

export const addBuildingLayer = (map: any, layerElement: layerListElementType, opacity = 1, color = '#dee7e7') => {
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



export const addPolygonLayer = (map: any, smallPopup: any, layerElement: layerListElementType, opacity = 0.5, color = ['red']) => {
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

