
import type { IGeojsonDataType } from "./geojsonTypes";

export interface IMapStyle {
    id: number,
    name: string,
    value: string,
    image: string
}


export interface IMapDetailsType  {
    id: number,
    center: number[],
    zoom: number,
    pitch: number,
    bearing: number
};


export interface ILayerListElementType  {
    id: number,
    icon: string,
    type: IGeojsonDataType,
    isShown: boolean,
    layerName: string,
    hasFilter: boolean,
    sourceName: string,
    initialCoordinates?: number[],
    color?: string,
    data?: any,

}

