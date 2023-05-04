import type { IGeojsonDataType } from '$lib/types/geojsonTypes';
import type { ILayerListElementType } from '$lib/types/mapTypes';


export const getInitialCoordinates = (type: IGeojsonDataType, data: any) => {
    if (!data) return;
    switch (type) {
        case "Point":
            return data.features[0].geometry.coordinates;
        case "Polygon":
            return data.features[0].geometry.coordinates[0][0];
        case "LineString":
            return data.features[0].geometry.coordinates[0];
        default:
            return [0, 0];
    }
};

export const checkIfMapSourceExists = (sourceName: string, map: any) => {
    try {
        return !!map.getSource(sourceName);
    } catch (err) {
        return false;
    }
};

export const checkIfMapLayerExists = (layerName: string, map: any) => {
    try {
        return !!map.getLayer(layerName);
    } catch (err) {
        return false;
    }
};

export const removeExistingLayerFromMap = (map:any, layerName: string) => {
    if (map.getLayer(layerName)) {
        map.removeLayer(layerName);
    }
};


export const addLayerSource = (map: any, sourceName: string, data: any) => {
    const sourceExists = checkIfMapSourceExists(sourceName, map);
    if (!sourceExists) {
        map.addSource(sourceName, {
            type: 'geojson',
            lineMetrics: true,
            data: data
        });
    } else {
        map.getSource(sourceName).setData(data);
    }
}
