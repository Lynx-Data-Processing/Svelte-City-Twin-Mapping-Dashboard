
import type { IGeojsonDataType, IGeojsonType } from "./geojsonTypes";

export interface ILatLngType {
    lat: number,
    lng: number
}

export interface IMapDetailsType {
    zoom: number,
    mapTypeId: string,
    heading: number,
    tilt: number,
    center: ILatLngType
}

export interface ILayerListElementType  {
    isTrip: boolean,
    icon: string,
    type: IGeojsonDataType,
    isVisible: boolean,
    layerName: string,
    hasFilter?: boolean,
    sourceName: string,
    initialCoordinates?: ILatLngType,
    color?: string,
    geojson?: IGeojsonType,
    googleMapLayer?: any
}

export const zoomLevelMap: { [key in IGeojsonDataType]?: number } = {
    Point: 19,
    LineString: 16,
    Polygon: 14,
    MultiPolygon: 15,
    FeatureCollection: 15,
    Feature: 15,
    GeometryCollection: 15
};

