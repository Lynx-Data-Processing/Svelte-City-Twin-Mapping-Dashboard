import { v4 as uuidv4 } from 'uuid';

import type { IGeojsonData, IGeojsonDataType, IGeojsonFeatureType, IGeojsonType } from '$lib/types/geojsonTypes';

import { getSpeed, getVehicleSpeedColor } from '$lib/utils/vehicle-speed';

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


function generateCoordinates(lat: number, lng: number, heading: number): number[][] {
  const d = 5; // Distance along the line in meters
  const brng = (90 - heading) * Math.PI / 180; // Convert heading to radians

  const result = [[lng, lat]];
  if (heading === 0) {
    for (let i = 0; i < 4; i++) {
      lng = lng + (d * (Math.random() - 0.5)) / (111.319 * 1000);
      lat = lat + (d * (Math.random() - 0.5)) / (111.132 * 1000);

      result.push([lng, lat]);
    }
  } else {
    for (let i = 0; i < 4; i++) {
      lng = lng + (d * Math.cos(brng)) / (111.319 * 1000);
      lat = lat + (d * Math.sin(brng)) / (111.132 * 1000);

      result.push([lng, lat]);
    }
  }

  return result;
}


//* To use the data on mapbox, the data must be in GEOJSON format
//* Because all the data are points, we'll be creating point sets
export const rawSmarterAIGPSDataToGeojson = (rawData: any) => {
  const groupedArray = groupByKey(rawData, 'deviceId');
  const geoJsonArray = [];

  for (const [deviceId, innerArray] of Object.entries(groupedArray)) {
    try {

      //* Set initial Geojson element details
      const dataName = rawData.dataName || `GPS - ${deviceId}`;
      const dateTime = rawData.dateTime || uuidv4();
      const dataType = rawData.dataType || "LineString";
      const hasFilter = rawData.hasFilter || true;
      //* Create Geojson feature collection
      const geoJson: IGeojsonType = {
        type: 'FeatureCollection',
        dataName,
        dateTime,
        dataType,
        hasFilter,
        features: [],
      };

      for (const point of (innerArray as any)) {
        if (point.GEO_LOCATION) {
          let coordinates = generateCoordinates(parseFloat(point.GEO_LOCATION.latitude), parseFloat(point.GEO_LOCATION.longitude), parseFloat(point.GEO_LOCATION.heading));
          const properties = point.GEO_LOCATION;
          properties.EventId = point.id;
          properties.DeviceId = point.deviceId;
          properties.Speed = getSpeed(properties);
          properties.EndpointId = point.endpointId;
          properties.StartTime = point.recordingStartTimestamp;
          properties.EndTime = point.recordingEndTimestamp;
          properties.Color = getVehicleSpeedColor(getSpeed(properties));

          //* Create the final feature config and push it to the feature array
          const feature: IGeojsonFeatureType = { type: 'Feature', geometry: { type: "LineString", coordinates }, properties };
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


export const rawGPSDataToGeojsonData = (rawData: any, name = 'General', geojsonDataType = "Point", color = 'Blue') => {
  try {

    rawData = JSON.parse(rawData)
    rawData = rawData;
    //* Set initial Geojson element details
    const dataName = rawData.dataName || name;
    const dateTime = rawData.dateTime || uuidv4();
    const dataType = rawData.dataType || geojsonDataType;
    const hasFilter = rawData.hasFilter || false;
    //* Create Geojson feature collection
    const geoJson: IGeojsonType = {
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
      const feature: IGeojsonFeatureType = {
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
