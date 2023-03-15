
export type videoType = {
    eventId: number
    deviceId: number
    endpointId: number,
    startTimestamp: number,
    endTimestamp: number,
    videoUrl?: string
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
