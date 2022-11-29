
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

export type videoType = {
    eventId: number
    deviceId: number
    endpointId: number,
    startTimestamp: number,
    endTimestamp: number,
    videoUrl: string
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
    version: number

};

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

