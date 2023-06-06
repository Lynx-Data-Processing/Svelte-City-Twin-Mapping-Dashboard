import { PUBLIC_API_KEY, PUBLIC_TENANT_ID, PUBLIC_V5_API_KEY } from '$env/static/public';
import { API_SMARTER_AI_ENDPOINT_INFO_URL, API_SMARTER_AI_ENDPOINT_LIST_URL, API_SMARTER_AI_EVENTS_URL, API_SMARTER_AI_MEDIA_LIST_URL, API_SMARTER_AI_SENSOR_REPORT_URL, API_SMARTER_AI_TRIPS_URL } from '$lib/constants/global';
import type { IEventType, IMediaRecordingType, ITripEventWithSensorDataType, IVideoType } from '$lib/types/eventTypes';
import type { ITripEvent } from '$lib/types/tripTypes';
import type { IDateTimeDictionaryType, ITripsParamType } from '$lib/types/types';
import axios from 'axios';
import { dateTimeToMillisecondUnix } from '../utils/date-format';


//* Fetch all devices under the Tenant key
export const getListOfDevicesUnderTenant = async () => {
  const params = new URLSearchParams({
    tenantId: PUBLIC_TENANT_ID,
    limit: '1000',
    offset: '0',
    status: 'ANY_STATUS',
    type: 'ANY',
    secretToken: PUBLIC_API_KEY
  });

  const config = {
    method: 'get',
    url: `${API_SMARTER_AI_ENDPOINT_LIST_URL}?${params.toString()}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };


  try {


    const promise = await axios(config);
    return promise;
  } catch (error: any) {
    if (error.response) {
      return error.response.status;
    } if (error.request) {
      return error.request;
    }
    return error.message;
  }
};

//* If we need more information about the device
export const getDeviceDetails = async (deviceId: string) => {

  const params = new URLSearchParams({
    endpointId: deviceId,
    secretToken: PUBLIC_API_KEY
  });

  const config = {
    method: 'get',
    url: `${API_SMARTER_AI_ENDPOINT_INFO_URL}?${params.toString()}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };


  try {
    const promise = await axios(config);
    return promise;
  } catch (error: any) {
    if (error.response) {
      return error.response.status;
    } if (error.request) {
      return error.request;
    }
    return error.message;
  }
};

//* Fetch all videos from the device, all videos are in MP4 format
//* The api returns video meta data and videos together
//* API ONLY loads videos saved on the cloud
export const getVideo = async (gpsElement: ITripEventWithSensorDataType) => {

  const params = new URLSearchParams({
    endpointId: `${gpsElement.endpointId}`,
    fromTime: `${gpsElement.recordingStartTimestamp}`,
    toTime: `${gpsElement.recordingEndTimestamp}`
  });

  const config = {
    method: 'get',
    url: `${API_SMARTER_AI_MEDIA_LIST_URL}?${params.toString()}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${PUBLIC_API_KEY}`,
    },
  };

  try {


    const result = await axios(config);
    const videos: IMediaRecordingType[] = result.data.mediaEventRecordings.filter((res: IMediaRecordingType) => res.type === 'VIDEO'); // && res.endTimestamp > timestamp && res.startTimestamp < timestamp
   
    return videos;

  } catch (error: any) {
    if (error.response) {
      return error.response.status;
    } if (error.request) {
      return error.request;
    }
    return error.message;
  }
};



export async function getSmarterAiEvents(dateTimeDictionary: IDateTimeDictionaryType, sensorQualityValue: number) {

  const params = new URLSearchParams({
    secretToken: PUBLIC_API_KEY,
    endpointId: '4326',
    pageSize: '100',
    tenantId: PUBLIC_TENANT_ID,
    startTimestamp: dateTimeToMillisecondUnix(dateTimeDictionary.startDateTime).toString(),
    endTimestamp: dateTimeToMillisecondUnix(dateTimeDictionary.endDateTime).toString(),
  });

  const results = [];

  for (let i = 0; i < sensorQualityValue; i++) {
    try {
      const response = await axios.get(`${API_SMARTER_AI_EVENTS_URL}?${params.toString()}`);
      const eventList = response.data.eventList;
      const lastObject = eventList[eventList.length - 1];

      if (!lastObject) {
        break;
      }

      params.set('lastMaxEventId', lastObject.id);
      params.set('lastMaxEventTimestamp', lastObject.eventTimestamp);

      results.push(eventList);
    } catch (error) {
      console.error(error);
    }
  }

  return results.flat();
}


export const getSmarterAiTripWithGps = async (tripId: string) => {
  const params = new URLSearchParams({
    tenantId: PUBLIC_TENANT_ID,
  });

  const config = {
    method: 'get',
    url: `${API_SMARTER_AI_TRIPS_URL}/${tripId}?${params.toString()}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${PUBLIC_V5_API_KEY}`,
    },
  };

  try {
    const promise = await axios(config);
    return promise.data as ITripEvent;
  }
  catch (error: any) {
    if (error.response) {
      return error.response.status;
    } if (error.request) {
      return error.request;
    }
    return error.message;
  }
}


export const getSmarterAiTrips = async (tripsParams: ITripsParamType) => {

  const params = new URLSearchParams({
   
    limit: tripsParams.limit.toString(),
    tenantId: PUBLIC_TENANT_ID,
    fromTimestamp: dateTimeToMillisecondUnix(tripsParams.startDateTime).toString(),
    toTimestamp: dateTimeToMillisecondUnix(tripsParams.endDateTime).toString(),
    offset: tripsParams.offset.toString(),
  });
  if(tripsParams.endpointId){
    params.set('endpointId', tripsParams.endpointId);
  }

  const results: ITripEvent[][] = [];

  for (let i = 0; i < 1; i++) {

    let config = {
      method: 'get',
      url: `${API_SMARTER_AI_TRIPS_URL}?${params.toString()}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${PUBLIC_V5_API_KEY}`,
      },
    };

    const response = await axios(config);

    if (response.status === 400) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    if (response.status !== 200) {
      throw new Error(`Error fetching trips: ${response.statusText}`);
    }

    const tripList = response.data.tripList;
    if (tripList.length === 0) {
      break;
    }

    params.set('offset', (tripsParams.offset * (i + 1)).toString());
    results.push(tripList as ITripEvent[]);
  }
  return results.flat();
}