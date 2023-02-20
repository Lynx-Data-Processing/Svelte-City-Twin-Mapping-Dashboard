import type { GeojsonEnum } from "./enums"

export type gpsFilterType = {
    id: string,
    name: string,
    default: number[],
    step: number,
    suffix: string,
    selected: number[]
}


export type geojsonType = {
    type: string,
    dataName: string,
    dateTime: string,
    dataType: GeojsonEnum,
    hasFilter: boolean,
    features: geojsonFeatureType[]
}

export type geojsonFeatureType = {
    type: string,
    geometry: object,
    properties: object

};
