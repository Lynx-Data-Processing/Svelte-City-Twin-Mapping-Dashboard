
export type dateTimeDictionaryType = {
    startDateTime : string,
    endDateTime : string,
}

export type gpsFilterType = {
    id: string,
    name: string,
    default: number[],
    step: number,
    suffix: string,
    selected: number[]
}

export type layerLisElementType = {
    id: number,
    icon: string,
    type: string,
    isShown: boolean,
    layerName: string,
    hasFilter: boolean,
    sourceName: string,
    data: any,
}