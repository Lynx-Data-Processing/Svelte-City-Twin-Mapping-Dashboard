import { v4 as uuidv4 } from 'uuid';

import { GeojsonDataEnum, GeojsonEnum } from '../../types/enums';
import type { geojsonFeatureType, geojsonType } from '../../types/types';

import { getSpeed, getVehicleSpeedColor } from '../vehicle-speed';

//* Example
//* { 'AlexDashcam' : [{point1}, {point2}, {point3}], 'AmirDashcam: [{point1}, {point2}, {point3}]}
//* Group the data by the deviceId key
const groupByKey = (array: any[], key: any) => {
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
export const rawSmarterAIGPSDataToGeojson = (rawData: any) => {
  const groupedArray = groupByKey(rawData, 'deviceId');
  const geoJsonArray = [];

  for (const [deviceId, innerArray] of Object.entries(groupedArray)) {
    try {

      //* Set initial Geojson element details
      const dataName = rawData.dataName || `${GeojsonDataEnum.GPS} - ${deviceId}`;
      const dateTime = rawData.dateTime || uuidv4();
      const dataType = rawData.dataType || GeojsonEnum.Point;
      const hasFilter = rawData.hasFilter || true;
      //* Create Geojson feature collection
      const geoJson: geojsonType = {
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
          const feature: geojsonFeatureType = { type: 'Feature', geometry: { type: GeojsonEnum.Point, coordinates }, properties };
          geoJson.features.push(feature);

        }

      }

      //* Push the geojson element to the array if it has features
      if (geoJson.features.length > 0) {
        geoJsonArray.push(geoJson);
      }
    }
    catch (err) {
      console.error(err)
    }
  }
  return geoJsonArray;
};


export const rawGPSDataToGeojsonData = (rawData: any, name = 'General', geojsonDataType = GeojsonEnum.Point, color = 'Blue') => {
  try {

    rawData = JSON.parse(rawData)
    rawData = rawData;
    //* Set initial Geojson element details
    const dataName = rawData.dataName || name;
    const dateTime = rawData.dateTime || uuidv4();
    const dataType = rawData.dataType || geojsonDataType;
    const hasFilter = rawData.hasFilter || false;
    //* Create Geojson feature collection
    const geoJson: geojsonType = {
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
      const feature: geojsonFeatureType = {
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
