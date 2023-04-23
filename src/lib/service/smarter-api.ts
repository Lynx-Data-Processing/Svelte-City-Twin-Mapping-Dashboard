import { dateTimeToMillisecondUnix } from '../utils/date-format';
/* eslint-disable no-console */

import { PUBLIC_API_KEY, PUBLIC_API_SMARTER_AI_ENDPOINT_INFO_URL, PUBLIC_API_SMARTER_AI_ENDPOINT_LIST_URL, PUBLIC_API_SMARTER_AI_EVENTS_URL, PUBLIC_API_SMARTER_AI_MEDIA_LIST_URL, PUBLIC_DEVICE_ID, PUBLIC_TENANT_ID } from '$env/static/public';
import type { IMediaRecordingType, IVideoType } from '$lib/types/eventTypes';
import type { IDateTimeDictionaryType } from '$lib/types/types';
import axios from 'axios';


//* Fetch all devices under the Tenant key
export const getListOfDevicesUnderTenant = async () => {

  try {
    const config = {
      method: 'get',
      url: `${PUBLIC_API_SMARTER_AI_ENDPOINT_LIST_URL}?tenantId=${PUBLIC_TENANT_ID}&limit=1000&offset=0&status=ANY_STATUS&type=ANY&secretToken=${PUBLIC_API_KEY}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

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

  try {
    const config = {
      method: 'get',
      url: `${PUBLIC_API_SMARTER_AI_ENDPOINT_INFO_URL}?endpointId=${deviceId}&secretToken=${PUBLIC_API_KEY}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

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

  try {
    const config = {
      method: 'get',
      url: `${PUBLIC_API_SMARTER_AI_MEDIA_LIST_URL}?endpointId=${gpsElement.EndpointId}&fromTime=${gpsElement.StartTime}&toTime=${ gpsElement.EndTime}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${PUBLIC_API_KEY}`,
      },
    };

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

export const getAllEvents = async (fromDateTime: string, toDateTime: string) => {

  try {
    let config = {
      method: 'get',
      url: `${PUBLIC_API_SMARTER_AI_EVENTS_URL}?secretToken=${PUBLIC_API_KEY}&pageSize=100&tenantId=${PUBLIC_TENANT_ID}&deviceId=CK20520033`,
      headers: {}
    };
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
}



export const getGeojsonDataFromFile = async (url: string) => {
  try {
    const config = {
      method: 'get',
      url: `${url}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

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

}



const HOUR_IN_MILLISECONDS = 3600000;

export async function getSmarterAiEvents(dateTimeDictionary: IDateTimeDictionaryType) {
  const storageKey = 'apiResults';
  const storageExpiryKey = 'apiResultsExpiry';
  const storageDateTimeDictionaryKey = 'storedDateTimeDictionary';

  const now = new Date().getTime();
  const storedExpiry = localStorage.getItem(storageExpiryKey);
  const storedDateTimeDictionary = localStorage.getItem(storageDateTimeDictionaryKey);

  // Check if the results are still valid and return them
  if (storedExpiry && now < Number(storedExpiry)) {
    const storedResults = localStorage.getItem(storageKey);

    // If stored DateTimeDictionary is the same as the new one, return the stored results
    if (storedResults && storedDateTimeDictionary === JSON.stringify(dateTimeDictionary)) {
      return JSON.parse(storedResults);
    }
  }

  const baseUrl = 'https://api.anyconnect.com/v2/event-messaging/events';
  const params = new URLSearchParams({
    secretToken: PUBLIC_API_KEY,
    endpointId: '4326',
    pageSize: '100',
    tenantId: PUBLIC_TENANT_ID,
    startTimestamp: dateTimeToMillisecondUnix(dateTimeDictionary.startDateTime).toString(),
    endTimestamp: dateTimeToMillisecondUnix(dateTimeDictionary.endDateTime).toString(),
  });

  const results = [];

  for (let i = 0; i < 5; i++) {
    try {
      const response = await axios.get(`${baseUrl}?${params.toString()}`);
      const eventList = response.data.eventList;
      const lastObject = eventList[eventList.length - 1];

      if(!lastObject) {
        break;
      }

      params.set('lastMaxEventId', lastObject.id);
      params.set('lastMaxEventTimestamp', lastObject.eventTimestamp);

      results.push(eventList);
    } catch (error) {
      console.error(error);
    }
  }

  const flatResults = results.flat();

  // Save the results to local storage with an expiry time and the dateTimeDictionary
  localStorage.setItem(storageKey, JSON.stringify(flatResults));
  localStorage.setItem(storageExpiryKey, (now + HOUR_IN_MILLISECONDS).toString());
  localStorage.setItem(storageDateTimeDictionaryKey, JSON.stringify(dateTimeDictionary));

  return flatResults;
}
