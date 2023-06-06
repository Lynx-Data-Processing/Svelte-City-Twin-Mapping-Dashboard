import { LINE_STRING, MULTI_LINE_STRING, MULTI_POINT, MULTI_POLYGON, POINT, POLYGON } from "$lib/constants/geojson";
import type { IGeojsonDataType, IGeojsonType } from "$lib/types/geojsonTypes";
import type { ILatLngType, ILayerListElementType } from "$lib/types/mapTypes";
import { checkIfElementExists, removeObjectWhereValueEqualsString } from "../filter-data";
import { formatText } from "../text-format";
import { createEventGoogleMapsPopup, createGooglePopup } from "./google-map-popup";
const pointStyle = (style: google.maps.Data.StyleOptions, color: string, size: number = 5) => {
    return {
        ...style,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: size,
            strokeColor: color,
            fillColor: color,
            fillOpacity: 1
        }
    };
}


const eventPointStyle = (style: google.maps.Data.StyleOptions, color: string, size: number = 7) => {
    return {
        ...style,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: size,
            strokeColor: color,
            fillColor: color,
            fillOpacity: 1
        }
    };
}

const polygonStyle = (style: google.maps.Data.StyleOptions, color: string) => {
    return {
        ...style,
        strokeColor: color,
        fillColor: color,
        fillOpacity: 0.5
    };
}
const lineStyle = (style: google.maps.Data.StyleOptions, color: string) => {
    style = {
        ...style,
        strokeWeight: 6,
    };
    return style;
}
const tripLineStyle = (style: google.maps.Data.StyleOptions, color: string) => {
    return {
        ...style,
        icons: [
            {
                icon: {
                    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    scale: 2,
                    strokeColor: 'white',
                    fillColor: 'white',
                    fillOpacity: 1
                },
                offset: '0',
                repeat: '100px'
            }
        ]
    }
}

export const addLayerToGoogleMap = (map: any, layerListElement: ILayerListElementType, updateSelectedEvent: Function) => {
    if (!map || !layerListElement.geojson) return;
    const layer = layerListElement.googleMapLayer;
    const isTripsLayer = layerListElement.isTrip;
    layer.addGeoJson(layerListElement.geojson);
    const infoWindow = new google.maps.InfoWindow();
    layer.setStyle((feature: any) => {
        const geometryType = feature.getGeometry().getType();
        const color =
            feature.getProperty('color') || "black"
        const size = feature.getProperty('size') || 5;
        const isEvent = feature.getProperty('isEvent') || false;
        let style: google.maps.Data.StyleOptions = {
            strokeColor: color || 'blue',
            strokeWeight: 4
        };
        if (geometryType === POINT || geometryType === MULTI_POINT) {
            style = isEvent ? eventPointStyle(style, color, size) : pointStyle(style, color, size);;
        }
        if (geometryType === POLYGON || geometryType === MULTI_POLYGON) {
            style = polygonStyle(style, color);
        }
        if (geometryType === LINE_STRING || geometryType === MULTI_LINE_STRING) {
            style = isTripsLayer ? tripLineStyle(style, color) : lineStyle(style, color);
        }
        return style;
    });

    // Add a click listener to the layer
    layer.addListener('click', (event: { feature: any; latLng: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined; }) => {
        let feature = event.feature;
        const isEvent = feature.getProperty('isEvent') || false;

        let contentString = '';
        if (isEvent) {
           feature = feature.j as IGeojsonDataType
           contentString = createEventGoogleMapsPopup(feature);
           updateSelectedEvent(feature);
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
    if (layerElement.isVisible) {
        layerElement.googleMapLayer.setMap(map); // Show the layer on the map
    } else {
        layerElement.googleMapLayer.setMap(null); // Hide the layer from the map
    }
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
    isTrip: boolean,
    layerName: string,
    type: IGeojsonDataType,
    isVisible: boolean,
    icon: string,
    color: string,
    geojson: IGeojsonType
) => {
    const layerElement: ILayerListElementType = {
        isTrip: isTrip || false,
        layerName: layerName || 'GPS Data',
        sourceName: layerName || 'GPS Data',
        type: type || 'LineString',
        isVisible: isVisible,
        icon: icon || 'fa-solid fa-car',
        color: color || 'black',
        geojson: geojson,
        initialCoordinates: geojson ? getInitialCoordinates(type, geojson) : { lat: 0, lng: 0 }
    };
    layerElement.googleMapLayer = new google.maps.Data();
    return layerElement;
};
export const getInitialCoordinates = (type: IGeojsonDataType, data: any): ILatLngType => {
    try {
        if (!data) return { lat: 0, lng: 0 };
        const initialCoordinateMap: { [key in IGeojsonDataType]?: number[] } = {
            Point: data.features[0].geometry.coordinates,
            LineString: data.features[0].geometry.coordinates[0],
            Polygon: data.features[0].geometry.coordinates[0],
            MultiPolygon: data.features[0].geometry.coordinates[0],
        };
        const coords = initialCoordinateMap[type];
        if (coords && coords.length >= 2) {
            return { lat: coords[1], lng: coords[0] };
        }
        return { lat: 0, lng: 0 };
    }
    catch (err) {
        return { lat: 0, lng: 0 };
    }
};
