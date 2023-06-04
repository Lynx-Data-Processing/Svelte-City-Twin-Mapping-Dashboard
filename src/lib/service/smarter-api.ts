import { PUBLIC_API_KEY, PUBLIC_TENANT_ID, PUBLIC_V5_API_KEY } from '$env/static/public';
import { API_SMARTER_AI_ENDPOINT_INFO_URL, API_SMARTER_AI_ENDPOINT_LIST_URL, API_SMARTER_AI_EVENTS_URL, API_SMARTER_AI_MEDIA_LIST_URL, API_SMARTER_AI_SENSOR_REPORT_URL, API_SMARTER_AI_TRIPS_URL } from '$lib/constants/global';
import type { IEventType, IMediaRecordingType, IVideoType } from '$lib/types/eventTypes';
import type { ITripEvent } from '$lib/types/tripTypes';
import type { IDateTimeDictionaryType } from '$lib/types/types';
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
export const getVideo = async (gpsElement: any) => {

  const params = new URLSearchParams({
    endpointId: gpsElement.EndpointId,
    fromTime: gpsElement.StartTime,
    toTime: gpsElement.EndTime
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
    const videoLink = videos.length ? videos[0].url : '';

    const video: IVideoType = {
      eventId: gpsElement.EventId,
      deviceId: gpsElement.DeviceId,
      endpointId: gpsElement.EndpointId,
      startTimestamp: gpsElement.StartTime,
      endTimestamp: gpsElement.EndTime,
      videoUrl: videoLink
    };
    return video;

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

//! : Add params for endpointName, limit and offset
// todo : endpointName is the name of the device (STRING)
// todo : limit is the number of trips to return (NUMBER)
// todo : offset is the number of trips to skip (NUMBER)

export const getSmarterAiTrips = async (dateTimeDictionary: IDateTimeDictionaryType) => {

  const params = new URLSearchParams({
    limit: "5",
    tenantId: PUBLIC_TENANT_ID,
    fromTimestamp: dateTimeToMillisecondUnix(dateTimeDictionary.startDateTime).toString(),
    toTimestamp: dateTimeToMillisecondUnix(dateTimeDictionary.endDateTime).toString(),
    offset: "0",
  });

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

    params.set('offset', (20 * (i + 1)).toString());
    results.push(tripList as ITripEvent[]);
  }
  return results.flat();
}