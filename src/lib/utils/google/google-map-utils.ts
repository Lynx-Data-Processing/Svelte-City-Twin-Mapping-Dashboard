import { LINE_STRING, MULTI_LINE_STRING, MULTI_POINT, MULTI_POLYGON, POINT, POLYGON, TRIP, TRIP_EVENT } from "$lib/constants/geojson";

import type { IGeojsonDataType, IGeojsonType } from "$lib/types/geojsonTypes";
import type { ILatLngType, ILayerListElementType } from "$lib/types/mapTypes";

import { KINGSTON_COORDINATES_OBJ } from "$lib/constants/kingston";
import type { IEventGoogleDataType, ITripGoogleDataType } from "$lib/types/googleTypes";
import { checkIfElementExists, removeObjectWhereValueEqualsString } from "../filter-data";
import { eventPointStyle, lineStyle, pointStyle, polygonStyle, tripLineStyle } from "./google-feature-style";
import { createEventGoogleMapsPopup, createGooglePopup, createTripGoogleMapsPopup } from "./google-map-popup";

export const addLayerToGoogleMap = (map: any, layerListElement: ILayerListElementType, updateSelectedEvent: Function) => {
    if (!map || !layerListElement.geojson) return;

    layerListElement.googleMapLayer = new google.maps.Data();
    const layer = layerListElement.googleMapLayer;
    layer.addGeoJson(layerListElement.geojson);
    const infoWindow = new google.maps.InfoWindow();
    layer.setStyle((feature: any) => {
        const geometryType = feature.getGeometry().getType();
        const color = feature.getProperty('color') || "black"
        const size = feature.getProperty('size') || 5;
        const featureType = feature.getProperty('type') || false;
        const hasArrows = feature.getProperty('hasArrows') || false;

        if (featureType === TRIP_EVENT) {
            return eventPointStyle(feature.j as IEventGoogleDataType, color);
        }
        else if (featureType === TRIP || hasArrows === true) {
            return tripLineStyle(color)
        }
        else if (geometryType === POINT || geometryType === MULTI_POINT) {
            return pointStyle(color, size);
        }
        else if (geometryType === POLYGON || geometryType === MULTI_POLYGON) {
            return polygonStyle(color);
        }
        else if (geometryType === LINE_STRING || geometryType === MULTI_LINE_STRING) {
            return lineStyle(color);
        }
        else {
            return {
                strokeColor: color || 'blue',
                strokeWeight: 4
            };;
        }
    });


    layer.addListener('click', (event: { feature: any; latLng: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined; }) => {
        const feature = event.feature;
        const featureType = feature.getProperty('type') || null;
        let contentString = '';
        if (featureType === TRIP_EVENT) {
            contentString = createEventGoogleMapsPopup(feature.j as IEventGoogleDataType);
            updateSelectedEvent(feature);
        }
        else if (featureType === TRIP) {
            contentString = createTripGoogleMapsPopup(feature.j as ITripGoogleDataType);
        }
        else {
            contentString = createGooglePopup(feature, layerListElement);
        }
        infoWindow.setContent(contentString);
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
    });

    if (layerListElement.type === POLYGON || layerListElement.type === MULTI_POLYGON) {
        layer.addListener('mouseover', (event: { feature: any; latLng: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined; }) => {
            const feature = event.feature;
            layer.overrideStyle(feature, { fillOpacity: 0.8 });
        });
        layer.addListener('mouseout', (event: { feature: any; latLng: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined; }) => {
            const feature = event.feature;
            layer.overrideStyle(feature, { fillOpacity: 0.5 });
        });
    }
    return map;
};

export const toggleGoogleMapLayerVisibility = (map: any, layerElement: ILayerListElementType) => {
    if (!map && layerElement.googleMapLayer) return;
    layerElement.isVisible ? layerElement.googleMapLayer.setMap(map) : layerElement.googleMapLayer.setMap(null);
    return map;
};

export const addLayerElementToLayerList = (
    layerList: ILayerListElementType[],
    layerListElement: ILayerListElementType
) => {
    let tempLayerList = layerList;
    if (checkIfElementExists(tempLayerList, 'layerName', layerListElement.layerName)) {
        tempLayerList = removeObjectWhereValueEqualsString(
            tempLayerList,
            'layerName',
            layerListElement.layerName
        );
    }
    tempLayerList.push(layerListElement);
    return tempLayerList;
};

export const createLayerElement = (
    layerName: string = 'GPS Data',
    type: IGeojsonDataType = POINT,
    isVisible: boolean = true,
    icon: string = 'fa-solid fa-car',
    color: string = 'black',
    layerImageUrl: string = '',
    geojson: IGeojsonType,
) => {
    const layerElement: ILayerListElementType = {
        layerName: layerName,
        sourceName: `${layerName}_Source`,
        type: type,
        isVisible: isVisible,
        icon: icon,
        color: color,
        geojson: geojson,
        initialCoordinates: getInitialCoordinates(type, geojson, KINGSTON_COORDINATES_OBJ),
        googleMapLayer: new google.maps.Data(),
        layerImageUrl: layerImageUrl
    };
    return layerElement;
};

const getInitialCoordinates = (type: IGeojsonDataType, data: any, defaultCoords: ILatLngType): ILatLngType => {
    try {
        if (!data) return { lat: 0, lng: 0 };
        const initialCoordinateMap: { [key in IGeojsonDataType]?: number[] } = {
            Point: data.features[0].geometry.coordinates,
            LineString: data.features[0].geometry.coordinates[0],
            Polygon: data.features[0].geometry.coordinates[0][0],
            MultiPolygon: data.features[0].geometry.coordinates[0],
        };
        const coords = initialCoordinateMap[type];
        if (coords && coords.length >= 2) {
            return { lat: coords[1], lng: coords[0] };
        }
        return defaultCoords;
    }
    catch (err) {
        return defaultCoords;
    }
};
