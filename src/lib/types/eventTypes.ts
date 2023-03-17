
export interface IVideoType {
    eventId: number
    deviceId: number
    endpointId: number,
    startTimestamp: number,
    endTimestamp: number,
    videoUrl: string
}


export interface IMediaRecordingType {
    startTimestamp: number,
    endTimestamp: number,
    source: string,
    type: string,
    url: string,
    urlExpiry: number,
    available: boolean
}

export interface ISnapshotType {
    source: string,
    fileContainer: string,
    filePath: string,
    server: string,
    downloadUrl: string,
    downloadUrlExpirationTime: number
}

export interface IEventType  {
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
    snapshots: ISnapshotType[],
    lastUpdatedTime: number,
    version: number,
    coordinates?: number[],

};

export interface IEventGeojsonType  {
    ACCELEROMETER: object,
    GYROSCOPE: object,
    GEO_LOCATION: object,
    VIDEO_META: object
}

export interface ISelectedPOIType  {
    lat: number,
    lng: number,
    data: any,
}

export interface ISelectedEventType  {
    lat: number,
    lng: number,
    data: any,
}