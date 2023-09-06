
import type { FEATURE, FEATURE_COLLECTION, GEOMETRY_COLLECTION, LINE_STRING, MULTI_LINE_STRING, MULTI_POINT, MULTI_POLYGON, POINT, POLYGON } from "$lib/features/map/constants/geojson";

export type GeojsonGeometryType = typeof POINT | typeof MULTI_POINT | typeof LINE_STRING | typeof MULTI_LINE_STRING | typeof POLYGON | typeof MULTI_POLYGON | typeof GEOMETRY_COLLECTION | typeof FEATURE | typeof FEATURE_COLLECTION;

export interface IGeojsonCollection {
    type: typeof FEATURE_COLLECTION,
    features: IGeojsonFeature[],
}

export interface IGeojsonFeature {
    type: string,
    geometry: {
        type: GeojsonGeometryType,
        coordinates: number[] | number[][] | number[][][] | number[][][][]
    },
    properties: {
        [key: string]: any,
        id: string
    }
};

export const zoomLevelMap: { [key in GeojsonGeometryType]?: number } = {
    Point: 19,
    LineString: 16,
    Polygon: 14,
    MultiPolygon: 15,
    FeatureCollection: 15,
    Feature: 15,
    GeometryCollection: 15
  };
  