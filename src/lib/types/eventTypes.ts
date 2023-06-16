import type { ITrip } from "./tripTypes";

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

export type Snapshot = {
  source: string;
  downloadUrl: string;
};


export const TRIP = "TRIP";
export const TRIP_EVENT = "TRIP_EVENT";

export type ITripEventType =  typeof TRIP | typeof TRIP_EVENT | string;


export interface IEventGoogleDataType extends IEventType, ISensorDataType, ITrip {
  type: ITripEventType
  color: string
  size: number
}

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


export interface IDeviceType {
  id: number,
  label: string,
  ipv4Address: string,
  ipv6Address: string,
  type: string,
  ownerUserId: number,
  imageUrl: string,
  createdTime: string,
  tenantId: number,
  tenantID: string,
  country: string,
  city: string,
  platform: string,
  packageVersion: string,
  hostIP: string,
  status: string,
  groupId: number,
  deviceKey: string,
  productId: string,
  systemImage: string,
  oemImage: string,
  vin: string,
  vinUpdatedAt: string,
  canbus: string,
}
