// Web worker for loading Google maps data and Kingston data on a separate thread

// TODO:
// - Load Google maps data
// - Load Kingston data

import type { 
    IMapDetailsType,
    ILayerListElementType,
} from '$lib/types/mapTypes';
import type {  IEventGoogleDataType } from '$lib/types/eventTypes';
import { getKingstonMapData } from '$lib/utils/geojson/kingston-geojson-util';
import {
    addLayerElementToLayerList,
    addLayerToGoogleMap,
    toggleGoogleMapLayerVisibility
} from '$lib/utils/geojson/google-map-utils';



let selectedEvent: IEventGoogleDataType | null = null;
const updateSelectedEvent = (googleMapEvent: IEventGoogleDataType) => {
    selectedEvent = googleMapEvent;
};

const initializeMap = async () => {
    // Map details
	let layerList: ILayerListElementType[] = [];
    let mapDetails: IMapDetailsType = {
		mapTypeId: 'roadmap',
		center: { lng: -76.491143, lat: 44.231689 },
		zoom: 17,
		tilt: 60,
		heading: -17.6
	};

    // Create map
    let mapDiv = new HTMLDivElement();
    let map = new google.maps.Map(mapDiv, mapDetails);

    // Get kingston data
    let tempKingstonLayers = await getKingstonMapData();
	if (!tempKingstonLayers || !tempKingstonLayers.length) return;

    // Load kingston data onto map
    for (let i = 0, len = tempKingstonLayers.length; i < len; i++) {
        layerList = addLayerElementToLayerList(layerList, tempKingstonLayers[i]);
        map = addLayerToGoogleMap(map, tempKingstonLayers[i], updateSelectedEvent);
        map = toggleGoogleMapLayerVisibility(map, tempKingstonLayers[i]);
    }

    // Return map
    return map;
}