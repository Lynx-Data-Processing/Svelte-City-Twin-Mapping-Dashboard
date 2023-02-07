import { v4 as uuidv4 } from 'uuid';
import { GeojsonEnum } from '../../types/enums';
import type { layerListElementType } from '../../types/types';
import { checkIfElementExists, removeObjectWhereValueEqualsString } from '../filter-data';



export const getInitialCoordinates = (type: GeojsonEnum, data: any) => {
    if (!data) return;
    if (type === GeojsonEnum.Point) {
        return data.features[0].geometry.coordinates;
    } else if (type === GeojsonEnum.Polygon) {
        return data.features[0].geometry.coordinates[0][0];
    } else if (type === GeojsonEnum.LineString) {
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


export const checkIfElementExistsAndRemove = (
    tempLayerList: layerListElementType[],
    layerName: string,
    map: any
) => {
    const hasElement = checkIfElementExists(tempLayerList, 'layerName', layerName);
    if (hasElement) {
        tempLayerList = removeObjectWhereValueEqualsString(tempLayerList, 'layerName', layerName);
        if (map.getLayer(layerName)) {
            map.removeLayer(layerName);
            map.removeSource(layerName);
        }
    }
    return tempLayerList;
};

export const addMapSource = (layerListElement: layerListElementType, map: any) => {
    try {
        const sourceExists = checkIfMapSourceExists(layerListElement.sourceName, map);

        if (!sourceExists) {
            map.addSource(layerListElement.sourceName, {
                type: 'geojson',
                data: layerListElement.data
            });
        } else {
            map.getSource(layerListElement.sourceName).setData(layerListElement.data);
        }
    } catch (err) { }
};


export const createLayerListElement = (
    layerName: string,
    sourceName: string,
    type: GeojsonEnum,
    isShown: boolean,
    faIcon: string,
    hasFilter: boolean,
    dataColor: string,
    cleanData: any
): layerListElementType => {
    //Create the new element and change the layer list
    const element: layerListElementType = {
        id: Math.floor(Math.random() * 100),
        icon: faIcon,
        type: type,
        isShown: isShown,
        layerName: layerName,
        hasFilter: hasFilter,
        sourceName: sourceName,
        initialCoordinates: getInitialCoordinates(type, cleanData),
        color: dataColor,
        data: cleanData
    };

    return element;
};