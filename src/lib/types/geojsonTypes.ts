
import type { FEATURE, FEATURE_COLLECTION, GEOMETRY_COLLECTION, LINE_STRING, MULTI_LINE_STRING, MULTI_POINT, MULTI_POLYGON, POINT, POLYGON } from "$lib/constants/geojson";

export type IGeojsonDataType = typeof POINT | typeof MULTI_POINT | typeof LINE_STRING | typeof MULTI_LINE_STRING | typeof POLYGON | typeof MULTI_POLYGON | typeof GEOMETRY_COLLECTION | typeof FEATURE | typeof FEATURE_COLLECTION;

export interface IGeojsonType {
    name?: string,
    isTrip?: boolean,
    type: typeof FEATURE_COLLECTION,
    features: IGeojsonFeatureType[],
    color?: string,
}

interface IGeojsonPropertiesType {
    [key: string]: any,
    id: string
}

export interface IGeojsonFeatureType {
    type: string,
    geometry: IGeometryType,
    properties: IGeojsonPropertiesType
};

interface IGeometryType {
    type: IGeojsonDataType,
    coordinates: number[] | number[][] | number[][][] | number[][][][]
}
