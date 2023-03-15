import { dateTimeToMillisecondUnix } from '../utils/date-format';
/* eslint-disable no-console */

import { PUBLIC_API_KEY, PUBLIC_API_SMARTER_AI_ENDPOINT_INFO_URL, PUBLIC_API_SMARTER_AI_ENDPOINT_LIST_URL, PUBLIC_API_SMARTER_AI_EVENTS_URL, PUBLIC_API_SMARTER_AI_MEDIA_LIST_URL, PUBLIC_DEVICE_ID, PUBLIC_TENANT_ID } from '$env/static/public';
import type { mediaRecordingType, videoType } from '$lib/types/eventTypes';
import type { dateTimeDictionaryType } from '$lib/types/types';
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
export const getAllVideoRecordingsFromDevice = async (deviceId: string, fromDateTime: string, toDateTime: string) => {

  try {
    const config = {
      method: 'get',
      url: `${PUBLIC_API_SMARTER_AI_MEDIA_LIST_URL}?endpointId=${deviceId}&fromTime=${fromDateTime}&toTime=${toDateTime}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${PUBLIC_API_KEY}`,
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


export const findVideo = async (StartTime: string, EndTime: string, deviceId: string) => {
  return getAllVideoRecordingsFromDevice(
    deviceId,
    StartTime,
    EndTime,
  ).then((result) => {
    const videos: mediaRecordingType[] = result.data.mediaEventRecordings.filter((res: mediaRecordingType) => res.type === 'VIDEO'); // && res.endTimestamp > timestamp && res.startTimestamp < timestamp
    return videos.length ? videos[0].url : '';
  });
};


export const getVideosFromGpsData = async (gpsData: any[]) => {
  if (!gpsData.length) return [];
  let tempVideoArray: videoType[] = [];
  for (const geojson of gpsData) {
    for (const gpsElement of geojson.features) {
      try {
        const videoLink: string = await findVideo(
          gpsElement.properties.StartTime,
          gpsElement.properties.EndTime,
          gpsElement.properties.EndpointId
        );
        const video: videoType = {
          eventId: gpsElement.properties.EventId,
          deviceId: gpsElement.properties.DeviceId,
          endpointId: gpsElement.properties.EndpointId,
          startTimestamp: gpsElement.properties.StartTime,
          endTimestamp: gpsElement.properties.EndTime,
          videoUrl: videoLink
        };

        tempVideoArray.push(video);
      } catch (error) {
        console.error(`Error retrieving video URL: ${error}`);
      }
    }
  }

  return tempVideoArray;
};


export async function callAndProcessAPI(dateTimeDictionary: dateTimeDictionaryType) {
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
  
  for (let i = 0; i < 1; i++) {
    try {
      const response = await axios.get(`${baseUrl}?${params.toString()}`);
      const eventList = response.data.eventList;
      const lastObject = eventList[eventList.length - 1];
      
      params.set('lastMaxEventId', lastObject.id);
      params.set('lastMaxEventTimestamp', lastObject.eventTimestamp);
      
      results.push(eventList);
    } catch (error) {
      console.error(error);
    }
  }
  
  return results.flat();
}

