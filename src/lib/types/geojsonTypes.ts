
import type { BUILDING, FEATURE, FEATURE_COLLECTION, GEOMETRY_COLLECTION, GPS, LINE_STRING, MULTI_LINE_STRING, MULTI_POINT, MULTI_POLYGON, NEIGHBORHOODS, POINT, POLYGON, TREES } from "$lib/constants/geojson";


export type IGeojsonDataType = typeof POINT | typeof MULTI_POINT | typeof LINE_STRING | typeof MULTI_LINE_STRING | typeof POLYGON | typeof MULTI_POLYGON | typeof GEOMETRY_COLLECTION | typeof FEATURE | typeof FEATURE_COLLECTION;

export type IGeojsonData = typeof GPS | typeof NEIGHBORHOODS | typeof TREES | typeof BUILDING;




export interface IGpsFilterType  {
    id: string,
    name: string,
    default: number[],
    step: number,
    suffix: string,
    selected: number[]
}


export interface IGeojsonType {
    type: string,
    dataName: string,
    dateTime: string,
    dataType: IGeojsonDataType,
    dataSourceName: string,
    hasFilter: boolean,
    features: IGeojsonFeatureType[]
}

export interface IGeometryType {
    type: IGeojsonDataType,
    coordinates: number[] | number[][] | number[][][] | number[][][][]
}

export interface IGeojsonFeatureType {
    type: string,
    geometry: IGeometryType,
    properties: object 

};
