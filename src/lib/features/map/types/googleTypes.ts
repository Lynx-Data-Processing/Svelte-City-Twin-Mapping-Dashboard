import type { TRIP, TRIP_EVENT } from "$lib/constants";
import type { IEventType, ISensorDataType } from "../../../types/eventTypes";
import type { ITrip } from "../../../types/tripTypes";
import type { IGeojsonDataType } from "./geojsonTypes";

export type ITripEventType =  typeof TRIP | typeof TRIP_EVENT ;
export interface IEventGoogleDataType extends IEventType, ISensorDataType, ITrip {
  type: ITripEventType
  color: string
  size: number
}
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

export const zoomLevelMap: { [key in IGeojsonDataType]?: number } = {
  Point: 19,
  LineString: 16,
  Polygon: 14,
  MultiPolygon: 15,
  FeatureCollection: 15,
  Feature: 15,
  GeometryCollection: 15
};


export interface ITripGoogleDataType extends ITrip {
    type: ITripEventType
    color: string
    size: number
  }