import { LINE_STRING, MULTI_LINE_STRING, MULTI_POINT, MULTI_POLYGON, POINT, POLYGON } from "$lib/constants/geojson";
import { EMERGENCY_RECORD, TAILGATING_GPS } from "$lib/constants/strings";
import { TRIP, TRIP_EVENT, type IEventGoogleDataType } from "$lib/types/eventTypes";
import type { IGeojsonDataType, IGeojsonType } from "$lib/types/geojsonTypes";
import type { IIconType, ILatLngType, ILayerListElementType } from "$lib/types/mapTypes";
import type { ITripGoogleDataType } from "$lib/types/tripTypes";
import { checkIfElementExists, removeObjectWhereValueEqualsString } from "../filter-data";
import { createEventGoogleMapsPopup, createGooglePopup, createTripGoogleMapsPopup } from "./google-map-popup";
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

const eventPointStyle = (feature: IEventGoogleDataType, style: google.maps.Data.StyleOptions, color: string, size: number = 7) => {
  
   
    let icon: IIconType = {
        path: '',
        scale: size,
        strokeColor: color,
        fillColor: color,
        fillOpacity: 0.8
    }

    let triggerName = feature.triggerName.toLowerCase();
    if (triggerName.includes(TAILGATING_GPS.toLowerCase())) {
        icon = {
            path: 'M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32H346.6c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2V400v48c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V400H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V400 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z',
            scale: 0.05,
            strokeColor: "#f5554a",
            fillColor: "#f5554a",
            fillOpacity: 1
        }
    }
    else if (triggerName.includes(EMERGENCY_RECORD.toLowerCase())) {
        icon = {
            path: "M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z",
            scale: 0.05,
            strokeColor: "#f5554a",
            fillColor: "#f5554a",
            fillOpacity: 1
        }
    }

    return {
        ...style,
        icon: icon
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
    layerListElement.googleMapLayer = new google.maps.Data();
    const layer = layerListElement.googleMapLayer;
    layer.addGeoJson(layerListElement.geojson);
    const infoWindow = new google.maps.InfoWindow();
    layer.setStyle((feature: any) => {
        const geometryType = feature.getGeometry().getType();
        const color = feature.getProperty('color') || "black"
        const size = feature.getProperty('size') || 5;
        const featureType = feature.getProperty('type') || false;
        let style: google.maps.Data.StyleOptions = {
            strokeColor: color || 'blue',
            strokeWeight: 4
        };
        if (geometryType === POINT || geometryType === MULTI_POINT) {
            if (featureType === TRIP_EVENT) {
                feature = feature.j as IEventGoogleDataType;
                style = eventPointStyle(feature, style, color);
            } else {
                style = pointStyle(style, color, size);
            }
        }
        if (geometryType === POLYGON || geometryType === MULTI_POLYGON) {
            style = polygonStyle(style, color);
        }
        if (geometryType === LINE_STRING || geometryType === MULTI_LINE_STRING) {
            if (featureType === TRIP) {
                style = tripLineStyle(style, color);
            } else {
                style = lineStyle(style, color);
            }
        }
        return style;
    });
    layer.addListener('click', (event: { feature: any; latLng: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined; }) => {
        let feature = event.feature;
        const featureType = feature.getProperty('type') || null;
        let contentString = '';
        if (featureType === TRIP_EVENT) {
            feature = feature.j as IEventGoogleDataType;
            contentString = createEventGoogleMapsPopup(feature);
            updateSelectedEvent(feature);
        }
        else if (featureType === TRIP) {
            feature = feature.j as ITripGoogleDataType;
            contentString = createTripGoogleMapsPopup(feature);
        }
        else {
            contentString = createGooglePopup(feature, layerListElement);
        }
        infoWindow.setContent(contentString);
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
    });
    if (layerListElement.type === POINT || layerListElement.type === MULTI_POINT) {
        layer.addListener('mouseover', (event: { feature: any; latLng: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined; }) => {
            const feature = event.feature;
            layer.overrideStyle(feature, { fillOpacity: 1 });
        }
        );
        layer.addListener('mouseout', (event: { feature: any; latLng: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined; }) => {
            const feature = event.feature;
            layer.overrideStyle(feature, { fillOpacity: 0.5 });
        }
        );
    }
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
    layerName: string = 'GPS Data',
    type: IGeojsonDataType = 'Point',
    isVisible: boolean = true,
    icon: string = 'fa-solid fa-car',
    color: string = 'black',
    geojson: IGeojsonType
) => {
    const layerElement: ILayerListElementType = {
        layerName: layerName,
        sourceName: layerName,
        type: type,
        isVisible: isVisible,
        icon: icon,
        color: color,
        geojson: geojson,
        initialCoordinates: getInitialCoordinates(type, geojson),
        googleMapLayer: new google.maps.Data()
    };
    return layerElement;
};

export const getInitialCoordinates = (type: IGeojsonDataType, data: any): ILatLngType => {
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
        return { lng: -76.491143, lat: 44.231689 }
    }
    catch (err) {
        return { lat: 0, lng: 0 };
    }
};
