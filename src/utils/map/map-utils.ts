import { GeojsonEnum } from '../../types/enums';
import type { layerLisElementType } from '../../types/types';
import { checkIfElementExists, removeObjectWhereValueEqualsString } from '../filter-data';



export const getInitialCoordinates = (data: any) => {
    if (!data) return;
    if (data.type === GeojsonEnum.Point) {
        return data.features[0].geometry.coordinates;
    } else if (data.type === GeojsonEnum.Polygon) {
        return data.features[0].geometry.coordinates[0][0];
    } else if (data.type === GeojsonEnum.LineString) {
        return data.features[0].geometry.coordinates[0];
    } else {
        return [0, 0];
    }
};

export const checkIfMapSourceExists = (sourceName: string, map: any) => {
    try {
        const source = map.getSource(sourceName);
        if (source) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};

export const checkIfMapLayerExists = (layerName: string, map: any) => {
    try {
        const layer = map.getLayer(layerName);
        if (layer) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};