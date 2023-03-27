import { GeojsonEnum } from '$lib/types/enums';
import type { ILayerListElementType } from '$lib/types/mapTypes';
import { v4 as uuidv4 } from 'uuid';
import { checkIfElementExists, removeObjectWhereValueEqualsString } from '../filter-data';



export const getInitialCoordinates = (type: GeojsonEnum, data: any) => {
    if (!data) return;
    switch (type) {
        case GeojsonEnum.Point:
            return data.features[0].geometry.coordinates;
        case GeojsonEnum.Polygon:
            return data.features[0].geometry.coordinates[0][0];
        case GeojsonEnum.LineString:
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


export const addMapSource = (layerListElement: ILayerListElementType, map: any) => {
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
    dataColor: string | null,
    cleanData: any
): ILayerListElementType => {
    //Create the new element and change the layer list
    const element: ILayerListElementType = {
        id: Math.floor(Math.random() * 100),
        icon: faIcon,
        type: type,
        isShown: isShown,
        layerName: layerName,
        hasFilter: hasFilter,
        sourceName: sourceName,
        initialCoordinates: getInitialCoordinates(type, cleanData),
        color: dataColor ? dataColor : 'red',
        data: cleanData
    };

    return element;
};