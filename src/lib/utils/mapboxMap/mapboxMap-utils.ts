import type { IGeojsonDataType } from '$lib/types/geojsonTypes';
import type { ILayerListElementType } from '$lib/types/mapTypes';
import { checkIfElementExists, removeObjectWhereValueEqualsString } from '../filter-data';


export const addLayerListElementToLayerList = (layerList : ILayerListElementType[], layerListElement: ILayerListElementType) => {
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

export const switchStyle = (map: any, isInitialDataLoaded: boolean, mapStyle: string) => {
    if (!map || !isInitialDataLoaded) return;
    map.setStyle(mapStyle);
};

export const resizeMap = (map: any) => {
    if (!map) return;
    map.resize();
};


export const updateMapCenter = (map: any, mapDetails: any) => {
    if (!map) return;
    map.flyTo({
        center: mapDetails.center,
        zoom: mapDetails.zoom
    });
};


export const getInitialCoordinates = (type: IGeojsonDataType, data: any) : number[] => {
    if (!data) return [0,0];
   
        const initialCoordinateMap: { [key in IGeojsonDataType]?: number } = {
            Point: data.features[0].geometry.coordinates ,
            LineString:  data.features[0].geometry.coordinates[0] ,
            Polygon: data.features[0].geometry.coordinates[0][0] ,
            MultiPolygon: data.features[0].geometry.coordinates[0][0] ,
        };
    
        const coords = [initialCoordinateMap[type]] as number[];
        if(coords){
            return coords;
        }
        return [0,0];
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

export const removeExistingSourceFromMap = (map:any, sourceName: string) => {
    if (map.getSource(sourceName)) {
        map.removeSource(sourceName);
    }
};

export const updateMapSource = (map: any, sourceName: string, data: any) => {
    const sourceExists = checkIfMapSourceExists(sourceName, map);
    if (sourceExists) {
        map.getSource(sourceName).setData(data);
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


export const addMapLayerVisibility = (map: any, layerList: ILayerListElementType[]) => {
    if (!map || !layerList) return;
   
    for (let i = 0, len = layerList.length; i < len; i++) {
        const layerElement = layerList[i];
        const {layerName, isShown} = layerElement;
        if(checkIfMapLayerExists(layerName, map)) {
            map.setLayoutProperty(
                layerName,
                'visibility',
                isShown ? 'visible' : 'none'
            );
        }
    }
};