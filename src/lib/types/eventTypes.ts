export interface ISensorData {
  eventSource: string;
  eventTimestamp: number;
  latitude: number;
  longitude: number;
  altitude: number;
}

export interface ISensorReading {
  occurrenceTime: number;
  sensorData: ISensorData;
}

export interface ISnapshotType {
  source: string,
  fileContainer: string,
  filePath: string,
  server: string,
  downloadUrl: string,
  downloadUrlExpirationTime: number
}

export interface Snapshot {
  source: string;
  downloadUrl: string;
};

export type IEventType = {
  id: string;
  eventTimestamp: number;
  eventEndTimestamp: number;
  recordingStartTimestamp: number;
  recordingEndTimestamp: number;
  triggerName: string;
  snapshots: Snapshot[];
};


export interface ISensorDataGeolocationType {
  latitude: string,
  longitude: string,
  altitude: string,
  speed: string,
  bearing: string,
  accuracy: string
}

export interface ISensorDataType {
  ACCELEROMETER: object,
  GYROSCOPE: object,
  GEO_LOCATION: ISensorDataGeolocationType,
  VIDEO_META: object
}

