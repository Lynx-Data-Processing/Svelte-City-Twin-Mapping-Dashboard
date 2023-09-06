
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
  

  
export interface ISensorReading {
    occurrenceTime: number;
    sensorData: {
      eventSource: string;
      eventTimestamp: number;
      latitude: number;
      longitude: number;
      altitude: number;
    };
  }

  
  export interface ISensorDataType {
    ACCELEROMETER: object,
    GYROSCOPE: object,
    GEO_LOCATION: {
      latitude: string,
      longitude: string,
      altitude: string,
      speed: string,
      bearing: string,
      accuracy: string
    },
    VIDEO_META: object
  }
  
  
  
export interface ISensorReading {
    occurrenceTime: number;
    sensorData: {
      eventSource: string;
      eventTimestamp: number;
      latitude: number;
      longitude: number;
      altitude: number;
    };
  }
  
  export type IEventType = {
    id: string;
    eventTimestamp: number;
    eventEndTimestamp: number;
    recordingStartTimestamp: number;
    recordingEndTimestamp: number;
    triggerName: string;
    snapshots: {
      source: string;
      downloadUrl: string;
    }[];
  };
  
  
  export interface ISensorDataType {
    ACCELEROMETER: object,
    GYROSCOPE: object,
    GEO_LOCATION: {
      latitude: string,
      longitude: string,
      altitude: string,
      speed: string,
      bearing: string,
      accuracy: string
    },
    VIDEO_META: object
  }
  
  
  
export interface ITripEvent {
    id: string;
    endpointId: number;
    endpointName: string;
    startTimestamp: number;
    endTimestamp: number;
    tripStatus: string;
    startGeo: {
      lon: number;
      lat: number;
    };
    endGeo: {
      lon: number;
      lat: number;
    };
    distance: number;
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
    
  
  export type ITrip = {
    id: string;
    endpointId: number;
    endpointName: string;
    startTimestamp: number;
    endTimestamp: number;
    tripStatus: string;
    startGeo: {
      lon: number;
      lat: number;
    };
    endGeo: {
      lon: number;
      lat: number;
    };
    distance: number;
    tripEvents: {
      tripEventType: string,
      geo: {
        lon: number;
        lat: number;
      },
      timestamp: number
    }[];
    triggeredEvents: IEventType[];
    geoPoints?: { geo: { lon: number; lat: number }; timestamp: number }[];
    driverTripWithScore: any[];
  };
  
  