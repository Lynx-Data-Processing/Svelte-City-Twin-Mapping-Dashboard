/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable dot-notation */
/* eslint-disable no-restricted-syntax */
import { v4 as uuidv4 } from 'uuid';
import type { geojsonFeatureType , geojsonType} from '../../types/types';


//* The Kingston API Json data needs to be cleaned
//* To use the data on mapbox, the data must be in GEOJSON format
//* All neighbourhoods are polygons
export const rawKingstonGPSDataToGeojsonNeighbourhoods = (rawData : any) => {
  //* Set initial Geojson element details
  const dataName = rawData.dataName ? rawData.dataName : 'Neighbourhoods';
  const dateTime = rawData.dateTime ? rawData.dateTime : uuidv4();
  const dataType = rawData.dataType ? rawData.dataType : 'Polygon';
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
  //* For every bigquery row create a GEOJSON GPS element
  for (const gpsElement of rawData) {

        //* Add a color to the polygon. Needs to be in hex #000000 format
        let polygonColor = (Math.floor(Math.random() * 16777215).toString(16)).toString();
        if (polygonColor.length !== 6) {
          polygonColor = polygonColor.padEnd(6, '0');
        }

    const coordinates = gpsElement.fields.geojson.coordinates;
    const properties = {
      Dataset_ID: gpsElement.datasetid ? gpsElement.datasetid : uuidv4(),
      Neighbourhood_Id: gpsElement.fields.neighbourhood_id ? gpsElement.fields.neighbourhood_id : uuidv4(),
      Name: gpsElement.fields.name ? gpsElement.fields.name : 'N/A',
      Time: gpsElement.record_timestamp ? gpsElement.record_timestamp : '0000',
      UTCTime: new Date(gpsElement.record_timestamp).toUTCString(),
      Color : `#${polygonColor}`,
    };

    

    //* Create the final feature config and add the feature id for the ability to hover
    const feature : geojsonFeatureType = {
      type: 'Feature', geometry: { type: 'Polygon', coordinates }, properties,
    };
    geoJson.features.push(feature);
  }
  return geoJson;
};

// trees
export const rawKingstonTreeDataToGeojsonTrees = (rawData : any) => {
  //* Set initial Geojson element details
  const dataName = rawData.dataName || 'Trees';
  const dateTime = rawData.dateTime || uuidv4();
  const dataType = rawData.dataType || 'Point';
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
  //* For every bigquery row create a GEOJSON GPS element
  for (const gpsElement of rawData) {
    const coordinates = gpsElement.fields.geojson.coordinates;
    const properties = {
      Dataset_ID: gpsElement.datasetid || uuidv4(),
      Common_Name: gpsElement.fields.common_name || uuidv4(),
      Scientific_Name: gpsElement.fields.scientific_name || 'N/A',
      Trunk_Diameter: gpsElement.trunk_diameter || '0000',
      Number_Of_Stems: gpsElement.number_of_stems || 1,
      Color : 'Green',
      Size : gpsElement.trunk_diameter || 1,
    };
    // Make the tree points green
 

    //* Create the final feature config and add the feature id for the ability to hover
    const feature = {
      type: 'Feature', geometry: { type: 'Point', coordinates }, properties,
    };
    geoJson.features.push(feature);
  }
  return geoJson;
};


export const rawKingstonDataToGeojsonData = (rawData : any, name = 'General', geojsonDataType = 'Point', color= 'Random') => {
  try {
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
    //* For every bigquery row create a GEOJSON GPS element
    for (const gpsElement of rawData) {
      let coordinates = gpsElement.fields.geojson.coordinates || gpsElement.geometry.coordinates;


      const properties = gpsElement.fields;
      properties.Size = 1;

      //* If a color was not specified, generate a random color
      if(color === 'Random'){
        let elementColor = (Math.floor(Math.random() * 16777215).toString(16)).toString();
        properties.Color = elementColor.length !== 6 ?   elementColor.padEnd(6, '0')  :`#${elementColor}`;        
      }
      else{
        properties.Color = color;
      }
    
      //* Create the final feature config and add the feature id for the ability to hover
      const feature = {
        type: 'Feature', geometry: { type: geojsonDataType, coordinates }, properties,
      };
      geoJson.features.push(feature);
    }
    console.log(geoJson)
    return geoJson;
  }
  catch (err) {
    console.log(err);
  }
};

