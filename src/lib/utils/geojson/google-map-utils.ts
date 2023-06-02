import { LINE_STRING, MULTI_LINE_STRING, MULTI_POLYGON, POLYGON } from "$lib/constants/geojson";
import type { IGeojsonDataType, IGeojsonType } from "$lib/types/geojsonTypes";
import type { ILatLngType, ILayerListElementType } from "$lib/types/mapTypes";
import { checkIfElementExists, removeObjectWhereValueEqualsString } from "../filter-data";


export const addLayerToGoogleMap = (map: any, layerListElement: ILayerListElementType) => {
    if (!map || !layerListElement.geojson) return;
    const layer = layerListElement.googleMapLayer;
    layer.addGeoJson(layerListElement.geojson);
    layer.setStyle((feature: { getProperty: (arg0: string) => any }) => {
        const geometryType = layerListElement.type;
        const color =
            feature.getProperty('color') || '#' + Math.floor(Math.random() * 16777215).toString(16);
        let style: google.maps.Data.StyleOptions = {
            strokeColor: color || 'blue',
            strokeWeight: 4
        };



        if (geometryType === POLYGON || geometryType === MULTI_POLYGON) {
            style = {
                ...style,
                strokeColor: color,
                fillColor: color,
                fillOpacity: 0.3
            };
        }

        if (geometryType === LINE_STRING || geometryType === MULTI_LINE_STRING) {
            style = {
                ...style,
                icons: [
                    {
                        icon: {
                            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                            scale: 2, // Change this value to change the size of the arrow
                            strokeColor: 'white',
                            fillColor: 'white',
                            fillOpacity: 1
                        },
                        offset: '0',
                        repeat: '100px' // Change this value to change the spacing of the arrows
                    }
                ]
            };
        }

        return style;
    });

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
    id: number,
    layerName: string,
    type: IGeojsonDataType,
    isVisible: boolean,
    icon: string,
    color: string,
    geojson: IGeojsonType
) => {
    const layerElement: ILayerListElementType = {
        id: id || Math.floor(Math.random() * 100),
        layerName: layerName || 'GPS Data',
        sourceName: layerName || 'GPS Data',
        type: type || 'LineString',
        isVisible: isVisible || true,
        icon: icon || 'fa-solid fa-car',
        color: color || 'black',
        geojson: geojson,
        initialCoordinates: getInitialCoordinates(type, geojson)
    };
    layerElement.googleMapLayer = new google.maps.Data();
    return layerElement;

};

export const getInitialCoordinates = (type: IGeojsonDataType, data: any): ILatLngType => {
    if (!data) return { lat: 0, lng: 0 };

    const initialCoordinateMap: { [key in IGeojsonDataType]?: number[] } = {
        Point: data.features[0].geometry.coordinates,
        LineString: data.features[0].geometry.coordinates[0],
        Polygon: data.features[0].geometry.coordinates[0][0],
        MultiPolygon: data.features[0].geometry.coordinates[0][0],
    };

    const coords = initialCoordinateMap[type];
    if (coords && coords.length >= 2) {
        return { lat: coords[1], lng: coords[0] };
    }

    return { lat: 0, lng: 0 };
};

