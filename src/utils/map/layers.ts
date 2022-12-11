import { buildPopup } from '../popup/popup-builder';
import type { layerLisElementType,  selectedEventType, selectedPOIType, videoType } from '../../types/types';

export 	const addTerrainLayer = (map:any,) => {
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

    return map;
};


export const addBuildingLayer = (map:any, fillList : layerLisElementType, opacity = 1, color = '#dee7e7') => {
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

    return map;
};

export const addPolygonLayer = (map:any, smallPopup: any, fillList : layerLisElementType, opacity = 0.5, color = ['red']) => {
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
    map.on('click', fillList.layerName, (e : any) => {
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


export const addLineLayer = (map:any, smallPopup: any, fillList : layerLisElementType, lineWidth = 4, color = ['red']) => {
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
    map.on('click', fillList.layerName, (e : any) => {
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

