
import type { GeojsonEnum } from "./enums";

export interface IMapStyle {
    id: number,
    name: string,
    value: string,
    img: string
}


export type mapDetailsType = {
    id: number,
    center: number[],
    zoom: number,
    pitch: number,
    bearing: number
};


export type layerListElementType = {
    id: number,
    icon: string,
    type: GeojsonEnum,
    isShown: boolean,
    layerName: string,
    hasFilter: boolean,
    sourceName: string,
    initialCoordinates: number[],
    color: string,
    data: any,
}
