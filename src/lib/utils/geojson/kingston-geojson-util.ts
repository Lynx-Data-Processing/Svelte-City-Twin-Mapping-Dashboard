import type { IGeojsonFeatureType, IGeojsonType } from '$lib/types/geojsonTypes';
import type { IGeojsonDataType } from './../../types/geojsonTypes';

const getCoordinates = (coordinates: any) => {
  if (coordinates.length >= 2) {
    coordinates = coordinates.slice(0, 2);
  }
  return coordinates;
};

const getColor = (color: string | null) => {
  if (color === null) {
    let elementColor = (Math.floor(Math.random() * 16777215).toString(16)).toString();
    return elementColor.length !== 6 ? elementColor.padEnd(6, '0') : `#${elementColor}`;
  }
  return color;
};

export const rawKingstonDataToGeojsonData = (rawData: any, name = 'General', geojsonDataType : IGeojsonDataType = "Point", color: string | null = null, time = '') => {
  try {
    //* Set initial Geojson element details
    const dataName = rawData.dataName || name;
    const dateTime = rawData.dateTime || time;
    const dataType = rawData.dataType || geojsonDataType;
    const hasFilter = rawData.hasFilter || false;

    //* Create Geojson feature collection
    const geoJson: IGeojsonType = {
      type: 'FeatureCollection',
      dataName,
      dateTime,
      dataType,
      dataSourceName: 'Kingston',
      hasFilter,
      features: [],
    };
    //* For every bigquery row create a GEOJSON GPS element
    for (const gpsElement of rawData) {

      try {
        let coordinates = getCoordinates(gpsElement.fields.geojson.coordinates);
        const properties = gpsElement.fields;
        gpsElement.fields.Size = 1;
        gpsElement.fields.geojson = undefined;
        gpsElement.fields.geo_point_2d = undefined;
        properties.Color = getColor(color);

        //* Create the final feature config and add the feature id for the ability to hover
        const feature : IGeojsonFeatureType = {
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
  }
  catch (err) {
    console.log(err);
  }
};

