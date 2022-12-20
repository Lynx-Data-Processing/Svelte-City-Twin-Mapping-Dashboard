/* eslint-disable no-console */

import { axiosUtility } from '../utils/fetch-data';
import { getUTCTime } from '../utils/time-util';
import {
  PUBLIC_API_SMARTER_AI_EVENTS_URL, PUBLIC_API_KEY, PUBLIC_TENANT_ID, PUBLIC_API_SMARTER_AI_ENDPOINT_LIST_URL,
  PUBLIC_API_SMARTER_AI_ENDPOINT_INFO_URL, PUBLIC_API_SMARTER_AI_MEDIA_LIST_URL, PUBLIC_DEVICE_ID
} from '$env/static/public'
import axios from 'axios';

//* Fetch all devices under the Geotab Tenant key
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
  } catch (error : any) {
    if (error.response) {
      return error.response.status;
    } if (error.request) {
      return error.request;
    }
    return error.message;
  }
};

//* If we need more information about the device
export const getDeviceDetails = async (deviceId : string) => {

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
  } catch (error : any) {
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
export const getAllVideoRecordingsFromDevice = async (deviceId : string, fromDateTime : string, toDateTime : string) => {

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
  } catch (error : any) {
    if (error.response) {
      return error.response.status;
    } if (error.request) {
      return error.request;
    }
    return error.message;
  }
};

export const getAllEvents = async (fromDateTime : string, toDateTime : string) => {

  try {
    let config = {
      method: 'get',
      url: `${PUBLIC_API_SMARTER_AI_EVENTS_URL}?secretToken=${PUBLIC_API_KEY}&pageSize=2000&tenantId=${PUBLIC_TENANT_ID}`,
      headers: {}
    };
    const promise = await axios(config);
    return promise;
  } catch (error : any) {
    if (error.response) {
      return error.response.status;
    } if (error.request) {
      return error.request;
    }
    return error.message;
  }
}



export const getGeojsonDataFromFile = async (url : string) => {
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
  } catch (error : any) {
    if (error.response) {
      return error.response.status;
    } if (error.request) {
      return error.request;
    }
    return error.message;
  }

}

export default getListOfDevicesUnderTenant;
