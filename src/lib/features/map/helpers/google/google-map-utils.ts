import { LINE_STRING, MULTI_POLYGON, POINT, POLYGON } from "$lib/features/map/constants/geojson";
import { KINGSTON_COORDINATES_OBJ } from "$lib/features/map/constants/kingston";
import type { GeojsonGeometryType, IFilters, IGeojsonCollection, IGeojsonFeature, ILatLngType, IMapLayer } from "$lib/features/map/types";
import { mapStore } from "../../store/mapStore";
import { arrowLineStyle, lineStyle, pointStyle, polygonStyle } from "./google-feature-style";
import { createMapPopup } from "./google-map-popup";

export const addLayerToGoogleMap = (map: any, layerElement: IMapLayer) => {
    if (!map || !layerElement.geojson) return;

    layerElement.googleMapLayer = new google.maps.Data();
    const layer = layerElement.googleMapLayer;
    layer.addGeoJson(layerElement.geojson);


    const infoWindow = new google.maps.InfoWindow();
    layer.setStyle((feature: google.maps.Data.Feature) => {
        const geometryType: GeojsonGeometryType = feature.getGeometry()!.getType() as GeojsonGeometryType;
        const hasArrows: boolean = feature.getProperty('hasArrows') || false;
        const color: string = feature.getProperty('color') || "black"
        const size: number = feature.getProperty('size') || 5;


        if (geometryType === POINT) {
            return pointStyle(color, size);
        }
        else if (geometryType === POLYGON) {
            return polygonStyle(color);
        }
        else if (geometryType === LINE_STRING) {
            return hasArrows ? arrowLineStyle(color) : lineStyle(color);
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
        const contentString = createMapPopup(feature, layerElement);
        infoWindow.setContent(contentString);
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);

        //* Set the selected map element in the store
        mapStore.setSelectedMapElement(feature);
    });

    if (layerElement.type === POLYGON || layerElement.type === MULTI_POLYGON) {
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

export const toggleGoogleMapLayerVisibility = (map: any, layerElement: IMapLayer) => {
    if (!map && layerElement.googleMapLayer) return;
    layerElement.isVisible ? layerElement.googleMapLayer.setMap(map) : layerElement.googleMapLayer.setMap(null);
    return map;
};

export const filterGoogleMapLayerGeojsonWithoutUpdatingLayerGeojson = (map: any, layerElement: IMapLayer, geojson: IGeojsonCollection) => {
    if (!map && layerElement.googleMapLayer) return;
    layerElement.googleMapLayer.setMap(null);
    layerElement.googleMapLayer.forEach((feature: any) => {
        layerElement.googleMapLayer.remove(feature);
    });
    layerElement.googleMapLayer.addGeoJson(geojson);
    layerElement.isVisible ? layerElement.googleMapLayer.setMap(map) : layerElement.googleMapLayer.setMap(null);
    return map;
}

export const createMapLayer = (
    layerName: string,
    type: GeojsonGeometryType,
    isVisible: boolean = true,
    icon: string,
    color: string,
    geojson: IGeojsonCollection,
) => {
    const layerElement: IMapLayer = {
        layerName: layerName,
        sourceName: `${layerName}_Source`,
        type: type,
        isVisible: isVisible,
        icon: icon,
        color: color,
        geojson: geojson,
        initialCoordinates: getMapLayerCenterCoordinates(type, geojson),
        googleMapLayer: new google.maps.Data(),
        filters: createLayerFilters(geojson),
    };
    return layerElement;
};

const getMapLayerCenterCoordinates = (type: GeojsonGeometryType, data: any, defaultCoords: ILatLngType = KINGSTON_COORDINATES_OBJ): ILatLngType => {
    try {
        if (!data) return { lat: 0, lng: 0 };
        const initialCoordinateMap: { [key in GeojsonGeometryType]?: number[] } = {
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

export const createLayerFilters = (geojson: any) => {
    const tempFilters: IFilters[] = [];
    geojson.features.forEach((feature: IGeojsonFeature) => {
        const properties = feature.properties;
        if (!properties) return;

        Object.keys(properties).forEach((key) => {
            const value = properties[key];
            const filter = tempFilters.find((filter) => filter.name === key);
            if (filter) {
                if (!filter.values.includes(value)) filter.values.push(value);
            } else {
                tempFilters.push({
                    name: key,
                    type: 'text',
                    values: [value],
                    selectedValue: 'All'
                });
            }
        });
    });
    return tempFilters;
}