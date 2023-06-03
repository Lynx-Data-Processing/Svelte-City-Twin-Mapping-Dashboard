import { LINE_STRING, MULTI_LINE_STRING, MULTI_POINT, MULTI_POLYGON, POINT, POLYGON } from "$lib/constants/geojson";
import type { IGeojsonDataType, IGeojsonType } from "$lib/types/geojsonTypes";
import type { ILatLngType, ILayerListElementType } from "$lib/types/mapTypes";
import { checkIfElementExists, removeObjectWhereValueEqualsString } from "../filter-data";

export const addLayerToGoogleMap = (map: any, layerListElement: ILayerListElementType) => {
    if (!map || !layerListElement.geojson) return;
    const layer = layerListElement.googleMapLayer;
    const isTripsLayer = layerListElement.isTrip;

    layer.addGeoJson(layerListElement.geojson);

    const infoWindow = new google.maps.InfoWindow();

    layer.setStyle((feature: any) => {
        const geometryType = feature.getGeometry().getType();
        const color =
            feature.getProperty('color') || '#' + Math.floor(Math.random() * 16777215).toString(16);
        let style: google.maps.Data.StyleOptions = {
            strokeColor: color || 'blue',
            strokeWeight: 8
        };

        if (geometryType === POINT || geometryType === MULTI_POINT) {
            style = {
                ...style,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 5,
                    strokeColor: color,
                    fillColor: color,
                    fillOpacity: 1
                }
            };
        }

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
                            scale: 2,
                            strokeColor: 'white',
                            fillColor: 'white',
                            fillOpacity: 1
                        },
                        offset: '0',
                        repeat: '100px'
                    }
                ]
            };
        }

        return style;
    });

    // Add a click listener to the layer
    layer.addListener('click', (event: { feature: any; latLng: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined; }) => {
        const feature = event.feature;

        // Initialize content string with feature id
        let contentString = `<p class="text-xl font-bold">${layerListElement.layerName}</p>`;
        // Loop through all properties of the feature
        feature.forEachProperty((value: any, name: any) => {
            contentString += `<p> <span class="font-bold">${name}</span>: ${value}</p>`;

        });

        infoWindow.setContent(contentString);
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
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
        isVisible: isVisible || true,
        icon: icon || 'fa-solid fa-car',
        color: color || 'black',
        geojson: geojson,
        initialCoordinates: geojson ? getInitialCoordinates(type, geojson) : {lat: 0 , lng: 0}
    };
    layerElement.googleMapLayer = new google.maps.Data();
    return layerElement;

};

export const getInitialCoordinates = (type: IGeojsonDataType, data: any): ILatLngType => {
    try{
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
    catch (err){
        return  { lat: 0, lng: 0 };
    }
};

