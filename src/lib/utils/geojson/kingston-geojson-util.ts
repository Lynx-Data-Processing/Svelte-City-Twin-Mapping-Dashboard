import type { IGeojsonFeatureType, IGeojsonType } from '$lib/types/geojsonTypes';
import type { IGeojsonDataType } from './../../types/geojsonTypes';

const getCoordinates = (coordinates: any) => {
  if (coordinates.length >= 2) {
    coordinates = coordinates.slice(0, 2);
  }
  return coordinates;
};

const getRandomColor = () => {
  return `#${(Math.floor(Math.random() * 16777215).toString(16)).toString()}`;
};

export const rawKingstonDataToGeojsonData = (rawData: any, name = 'General', geojsonDataType: IGeojsonDataType = "Point", color: string | null = null, time = '') => {

  //* Set initial Geojson element details
  const dataName = rawData.dataName || name;
  const dateTime = rawData.dateTime || time;
  const dataType = rawData.dataType || geojsonDataType;
  const hasFilter = rawData.hasFilter || false;
  const dataSourceName = rawData.dataSourceName || `${name}-Source`;

  //* Create Geojson feature collection
  const geoJson: IGeojsonType = {
    type: 'FeatureCollection',
    dataName,
    dateTime,
    dataType,
    dataSourceName,
    hasFilter,
    features: [],
  };

  for (let i = 0, len = rawData.length; i < len; i++) {

    try {
      const gpsElement = rawData[i];
      const properties = gpsElement.fields;

      let coordinates = getCoordinates(gpsElement.fields.geojson.coordinates);
      gpsElement.fields.Size = 1;
      properties.Color = getRandomColor();

      gpsElement.fields.geojson = undefined;
      gpsElement.fields.geo_point_2d = undefined;

      const feature: IGeojsonFeatureType = {
        type: 'Feature',
        geometry: { type: geojsonDataType, coordinates },
        properties,
      };
      geoJson.features.push(feature);
    }
    catch (err) {
      console.error(err);
      continue;
    }
  }

  return geoJson;
};

