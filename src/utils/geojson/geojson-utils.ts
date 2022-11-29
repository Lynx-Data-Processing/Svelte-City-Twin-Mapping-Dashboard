import { v4 as uuidv4 } from 'uuid';
import { SPEED_COLORS } from '../../constants';

import type { geojsonFeatureType , geojsonType} from '../../types/types';

//* Get a color for every 10km/h
//* Example: 0-9Km/h, 10-19km/h
export const getVehicleSpeedColor = (speed : number) => {
  let speedIndex : number = speed
  speedIndex = speedIndex >= SPEED_COLORS.length ? SPEED_COLORS.length - 1 : speedIndex;
  return SPEED_COLORS[speedIndex];
};

//* Get the speed from the properties object
//* Speed is sometimes not found in the object, in that case, return 0
const getSpeed = (properties: object) => {
  let speed = 0;
  for (const [key, value] of Object.entries(properties)) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('speed')) {
      speed = parseInt(value, 10);;
    }
  }
  return speed;
};

//* Example
//* { 'AlexDashcam' : [{point1}, {point2}, {point3}], 'AmirDashcam: [{point1}, {point2}, {point3}]}
//* Group the data by the deviceId key
const groupByKey = (array : any[], key: any) => {
  const groupedArray = array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue,
    );
    return result;
  }, {});
  return groupedArray;
};


//* To use the data on mapbox, the data must be in GEOJSON format
//* Because all the data are points, we'll be creating point sets
export const rawSmarterAIGPSDataToGeojson = (rawData : any) => {
  const groupedArray = groupByKey(rawData, 'deviceId');
  const geoJsonArray = [];

  for (const [deviceId, innerArray] of Object.entries(groupedArray)) {
    try {

      //* Set initial Geojson element details
      const dataName = rawData.dataName || `GPS - ${deviceId}`;
      const dateTime = rawData.dateTime || uuidv4();
      const dataType = rawData.dataType || 'Point';
      const hasFilter = rawData.hasFilter || true;
      //* Create Geojson feature collection
      const geoJson : geojsonType = {
        type: 'FeatureCollection',
        dataName,
        dateTime,
        dataType,
        hasFilter,
        features: [],
      };

      for (const point of (innerArray as any)) {
        if (point.GEO_LOCATION) {
          const coordinates = [parseFloat(point.GEO_LOCATION.longitude), parseFloat(point.GEO_LOCATION.latitude)];
          const properties = point.GEO_LOCATION;
          properties.EventId = point.id;
          properties.DeviceId = point.deviceId;
          properties.Speed = getSpeed(properties);
          properties.EndpointId = point.endpointId;
          properties.StartTime = point.recordingStartTimestamp;
          properties.EndTime = point.recordingEndTimestamp;
          properties.Color = getVehicleSpeedColor(getSpeed(properties));

          //* Create the final feature config and push it to the feature array
          const feature : geojsonFeatureType = { type: 'Feature', geometry: { type: 'Point', coordinates }, properties };
          geoJson.features.push(feature);
          
        }
       
      }

      geoJsonArray.push(geoJson);

    }
    catch (err) {
      console.error(err)
    }
  }
  return geoJsonArray;
};


export const rawGPSDataToGeojsonData = (rawData : any, name = 'General', geojsonDataType = 'Point', color= 'Blue') => {
  try {

    rawData = JSON.parse(rawData)
    rawData = rawData;
    //* Set initial Geojson element details
    const dataName = rawData.dataName || name;
    const dateTime = rawData.dateTime || uuidv4();
    const dataType = rawData.dataType || geojsonDataType;
    const hasFilter = rawData.hasFilter || false;
    //* Create Geojson feature collection
    const geoJson : geojsonType = {
      type: 'FeatureCollection',
      dataName,
      dateTime,
      dataType,
      hasFilter,
      features: [],
    };


    console.log(rawData)
    //* For every bigquery row create a GEOJSON GPS element
    for (const gpsElement of rawData.features) {

      console.log(gpsElement)
      let coordinates = gpsElement.geometry.coordinates;
      const properties = gpsElement.properties;
      properties.Size = 1;
      properties.Color = color;

      //* Create the final feature config and add the feature id for the ability to hover
      const feature : geojsonFeatureType = {
        type: 'Feature', geometry: { type: geojsonDataType, coordinates }, properties,
      };
      geoJson.features.push(feature);
    }
    return geoJson;
  }
  catch (err) {
    console.log(err);
  }
};
