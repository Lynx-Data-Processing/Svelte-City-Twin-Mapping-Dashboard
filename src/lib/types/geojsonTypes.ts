
import type { BUILDING, FA_FEATURE, FA_FEATURE_COLLECTION, FA_GEOMETRY_COLLECTION, FA_LINE_STRING, FA_MULTI_LINE_STRING, FA_MULTI_POINT, FA_MULTI_POLYGON, FA_POINT, FA_POLYGON, FEATURE, FEATURE_COLLECTION, GEOMETRY_COLLECTION, GPS, LINE_STRING, MULTI_LINE_STRING, MULTI_POINT, MULTI_POLYGON, NEIGHBORHOODS, POINT, POLYGON, TREES } from "$lib/constants/geojson";


export type IGeojsonDataType = typeof POINT | typeof MULTI_POINT | typeof LINE_STRING | typeof MULTI_LINE_STRING | typeof POLYGON | typeof MULTI_POLYGON | typeof GEOMETRY_COLLECTION | typeof FEATURE | typeof FEATURE_COLLECTION;

export type IGeojsonData = typeof GPS | typeof NEIGHBORHOODS | typeof TREES | typeof BUILDING;

export type IFontAwesomeIconGivenGeojsonType = typeof FA_POINT | typeof FA_MULTI_POINT | typeof FA_LINE_STRING | typeof FA_MULTI_LINE_STRING | typeof FA_POLYGON | typeof FA_MULTI_POLYGON | typeof FA_GEOMETRY_COLLECTION | typeof FA_FEATURE | typeof FA_FEATURE_COLLECTION; 


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
    hasFilter: boolean,
    features: IGeojsonFeatureType[]
}

export interface IGeometryType {
    type: string,
    coordinates: number[] | number[][] | number[][][] | number[][][][]
}

export interface IGeojsonFeatureType {
    type: string,
    geometry: IGeometryType,
    properties: object

};
