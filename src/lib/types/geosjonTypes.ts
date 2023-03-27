import type { GeojsonEnum } from "./enums"

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
    dataType: GeojsonEnum,
    hasFilter: boolean,
    features: IGeojsonFeatureType[]
}

export interface IGeojsonFeatureType {
    type: string,
    geometry: object,
    properties: object

};
