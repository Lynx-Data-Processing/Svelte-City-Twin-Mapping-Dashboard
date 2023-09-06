
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