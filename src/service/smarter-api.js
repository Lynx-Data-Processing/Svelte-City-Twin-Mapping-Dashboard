// @ts-nocheck
/* eslint-disable no-console */

import { axiosUtility } from '../utils/fetch-data';
import { getUTCTime} from '../utils/time-util';
import {  PUBLIC_API_SMARTER_AI_EVENTS_URL, PUBLIC_API_KEY,  PUBLIC_TENANT_ID,  PUBLIC_API_SMARTER_AI_ENDPOINT_LIST_URL,
  PUBLIC_API_SMARTER_AI_ENDPOINT_INFO_URL,  PUBLIC_API_SMARTER_AI_MEDIA_LIST_URL, PUBLIC_DEVICE_ID} from '$env/static/public'

//* Fetch all devices under the Geotab Tenant key
export const getListOfDevicesUnderTenant = () => {
  const config = {
    method: 'get',
    url: `${PUBLIC_API_SMARTER_AI_ENDPOINT_LIST_URL}?tenantId=${PUBLIC_TENANT_ID}&limit=1000&offset=0&status=ANY_STATUS&type=ANY&secretToken=${PUBLIC_API_KEY}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = axiosUtility(config);
  return response;
};

//* If we need more information about the device
export const getDeviceDetails = (deviceId) => {
  const config = {
    method: 'get',
    url: `${PUBLIC_API_SMARTER_AI_ENDPOINT_INFO_URL}?endpointId=${deviceId}&secretToken=${PUBLIC_API_KEY}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = axiosUtility(config);
  return response;
};

//* Fetch all videos from the device, all videos are in MP4 format
//* The api returns video meta data and videos together
//* API ONLY loads videos saved on the cloud
export const getAllVideoRecordingsFromDevice = (deviceId, fromDateTime, toDateTime) => {
  const config = {
    method: 'get',
    url: `${PUBLIC_API_SMARTER_AI_MEDIA_LIST_URL}?endpointId=${deviceId}&fromTime=${fromDateTime}&toTime=${toDateTime}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${PUBLIC_API_KEY}`,
    },
  };

  const response = axiosUtility(config);
  return response;
};

export const getAllEvents = (fromDateTime, toDateTime) =>{
  let config = {
    method: 'get',
    url: `${PUBLIC_API_SMARTER_AI_EVENTS_URL}?secretToken=${PUBLIC_API_KEY}&pageSize=20&deviceId=${PUBLIC_DEVICE_ID}&tenantId=${PUBLIC_TENANT_ID}&startTimestamp=1668120661000&endTimestamp=1668633730542`,
    headers: { }
  };
  const response = axiosUtility(config);
  return response;
} 

export default getListOfDevicesUnderTenant;
