// @ts-nocheck
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable dot-notation */
/* eslint-disable no-restricted-syntax */
import { v4 as uuidv4 } from 'uuid';
import { SPEED_COLORS } from '../../constants';

//* Get a color for every 10km/h
//* Example: 0-9Km/h, 10-19km/h
export const getVehicleSpeedColor = (speed) => {
  let speedIndex = parseInt(speed / 10, 10);
  speedIndex = speedIndex >= SPEED_COLORS.length ? SPEED_COLORS.length - 1 : speedIndex;
  return SPEED_COLORS[speedIndex];
};

//* Get the speed from the properties object
//* Speed is sometimes not found in the object, in that case, return 0
const getSpeed = (properties) => {
  let speed = 0;
  for (const [key, value] of Object.entries(properties)) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('speed')) {
      speed = value;
    }
  }
  return speed;
};

//* Example
//* { 'AlexDashcam' : [{point1}, {point2}, {point3}], 'AmirDashcam: [{point1}, {point2}, {point3}]}
//* Group the data by the deviceId key
const groupByKey = (array, key) => {
  const groupedArray = array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue,
    );
    return result;
  }, {});
  return groupedArray;
};

//* The bigquery data is known as raw gps data
//* To use the data on mapbox, the data must be in GEOJSON format
//* Because all the data are points, we'll be creating point sets
export const rawGPSDataToGeojson = (rawData) => {
  const groupedArray = groupByKey(rawData, 'deviceId');
  const geoJsonArray = [];

  for (const [key, innerArray] of Object.entries(groupedArray)) {
    //* Set initial Geojson element details
    const dataName = rawData.dataName || `GPS - ${key}`;
    const dateTime = rawData.dateTime || uuidv4();
    const dataType = rawData.dataType || 'Point';
    const hasFilter = rawData.hasFilter || true;
    //* Create Geojson feature collection
    const geoJson = {
      type: 'FeatureCollection',
      dataName,
      dateTime,
      dataType,
      hasFilter,
      features: [],
    };
    //* For every bigquery row create a GEOJSON GPS point
    //* Device_Id, Speed, Size, and UTCTime are the most import properties
    //! Speed is currently randomized because the data had little variation
    for (const point of innerArray) {
      const coordinates = [point.longitude, point.latitude];
      const properties = {
        Device_Id: point.deviceId || null,
        Speed: point.speed ? (point.speed / 5) * Math.random() * 3 : 0,
        Reason: point.gps_reason || 0,
        Valid: point.gps_valid || 0,
        Ignition: point.ignition || 0,
        Time: point.time.value || null,
        UTCTime: new Date(point.time.value).toUTCString() || null,
      };

      //* Add a color and size to the point
      //* Count is used for sizing. The larger the number, the bigger the point on the map
      properties.Color = getVehicleSpeedColor(getSpeed(properties));
      properties.Size = 1;

      //* Create the final feature config and push it to the feature array
      const feature = { type: 'Feature', geometry: { type: 'Point', coordinates }, properties };
      geoJson.features.push(feature);
    }
    geoJsonArray.push(geoJson);
  }
  return geoJsonArray;
};



export const rawSmarterAIGPSDataToGeojson = (rawData) => {
  const groupedArray = groupByKey(rawData, 'deviceId');
  const geoJsonArray = [];

  for (const [deviceId, innerArray] of Object.entries(groupedArray)) {
    //* Set initial Geojson element details
    const dataName = rawData.dataName || `GPS - ${deviceId}`;
    const dateTime = rawData.dateTime || uuidv4();
    const dataType = rawData.dataType || 'Point';
    const hasFilter = rawData.hasFilter || true;
    //* Create Geojson feature collection
    const geoJson = {
      type: 'FeatureCollection',
      dataName,
      dateTime,
      dataType,
      hasFilter,
      features: [],
    };
  
    for (const point of innerArray) {
      const coordinates = [parseFloat(point.GEO_LOCATION.longitude), parseFloat(point.GEO_LOCATION.latitude)];
      const properties = point.GEO_LOCATION;
      properties.Color = getVehicleSpeedColor(getSpeed(properties));
      
      //* Create the final feature config and push it to the feature array
      const feature = { type: 'Feature', geometry: { type: 'Point', coordinates }, properties };
      geoJson.features.push(feature);
    }
    geoJsonArray.push(geoJson);
  }
  return geoJsonArray;
};

export default rawGPSDataToGeojson;
