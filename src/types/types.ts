import type { GeojsonEnum } from "./enums"


export type dateTimeDictionaryType = {
    startDateTime: string,
    endDateTime: string,
}

export type gpsFilterType = {
    id: string,
    name: string,
    default: number[],
    step: number,
    suffix: string,
    selected: number[]
}

export interface footerElementType {
    id: number,
    name: string,
    url: string,
    icon: string | null
}

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

export type videoType = {
    eventId: number
    deviceId: number
    endpointId: number,
    startTimestamp: number,
    endTimestamp: number,
    videoUrl?: string
}

export interface IMapStyle {
    id: number,
    name: string,
    value: string,
    img: string
}


export type mediaRecordingType = {
    startTimestamp: number,
    endTimestamp: number,
    source: string,
    type: string,
    url: string,
    urlExpiry: number,
    available: boolean
}

export type snapshotType = {
    source: string,
    fileContainer: string,
    filePath: string,
    server: string,
    downloadUrl: string,
    downloadUrlExpirationTime: number
}

export type eventType = {
    id: number,
    tenantId: string,
    deviceId: string,
    deviceLabel: string,
    endpointId: number,
    eventTimestamp: number,
    eventEndTimestamp: number,
    recordingStartTimestamp: number,
    recordingEndTimestamp: number,
    eventSources: any[],
    eventTriggerId: string,
    triggerName: string,
    snapshots: snapshotType[],
    lastUpdatedTime: number,
    version: number,
    coordinates?: number[],

};

export type eventGeojsonType = {
    ACCELEROMETER: object,
    GYROSCOPE: object,
    GEO_LOCATION: object,
    VIDEO_META: object
}


export type mapDetailsType = {
    id: number,
    center: number[],
    zoom: number,
    pitch: number,
    bearing: number
};

export type menuComponentsType = {
    id: number,
    title: string,
    icon: string,
}


export type selectedPOIType = {
    lat: number,
    lng: number,
    data: any,
}

export type selectedEventType = {
    lat: number,
    lng: number,
    data: any,
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