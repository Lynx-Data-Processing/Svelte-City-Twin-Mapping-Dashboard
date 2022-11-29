/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable dot-notation */
/* eslint-disable no-restricted-syntax */
import { v4 as uuidv4 } from 'uuid';

//! API details
// https://opendatakingston.cityofkingston.ca/explore/dataset/neighbourhoods/information/?rows=10

//* The Kingston API Json data needs to be cleaned
//* To use the data on mapbox, the data must be in GEOJSON format
//* All neighbourhoods are polygons
export const rawKingstonGPSDataToGeojsonNeighbourhoods = (rawData) => {
  //* Set initial Geojson element details
  const dataName = rawData.dataName ? rawData.dataName : 'Neighbourhoods';
  const dateTime = rawData.dateTime ? rawData.dateTime : uuidv4();
  const dataType = rawData.dataType ? rawData.dataType : 'Polygon';

  //* Create Geojson feature collection
  const geoJson = {
    type: 'FeatureCollection',
    dataName,
    dateTime,
    dataType,
    features: [],
  };
  //* For every bigquery row create a GEOJSON GPS element
  for (const gpsElement of rawData) {
    const coordinates = gpsElement.fields.geojson.coordinates;
    const properties = {
      Dataset_ID: gpsElement.datasetid ? gpsElement.datasetid : uuidv4(),
      Neighbourhood_Id: gpsElement.fields.neighbourhood_id ? gpsElement.fields.neighbourhood_id : uuidv4(),
      Name: gpsElement.fields.name ? gpsElement.fields.name : 'N/A',
      Time: gpsElement.record_timestamp ? gpsElement.record_timestamp : '0000',
      UTCTime: new Date(gpsElement.record_timestamp).toUTCString(),
    };
    //* Add a color to the polygon. Needs to be in hex #000000 format
    let polygonColor = (Math.floor(Math.random() * 16777215).toString(16)).toString();
    if (polygonColor.length !== 6) {
      polygonColor = polygonColor.padEnd(6, '0');
    }
    properties.Color = `#${polygonColor}`;

    //* Create the final feature config and add the feature id for the ability to hover
    const featureId = gpsElement.fields.neighbourhood_id ? gpsElement.fields.neighbourhood_id : uuidv4();
    const feature = {
      type: 'Feature', id: featureId, geometry: { type: 'Polygon', coordinates }, properties,
    };
    geoJson.features.push(feature);
  }
  return geoJson;
};

// trees
export const rawKingstonTreeDataToGeojsonTrees = (rawData) => {
  //* Set initial Geojson element details
  const dataName = rawData.dataName || 'Trees';
  const dateTime = rawData.dateTime || uuidv4();
  const dataType = rawData.dataType || 'Point';

  //* Create Geojson feature collection
  const geoJson = {
    type: 'FeatureCollection',
    dataName,
    dateTime,
    dataType,
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
    };
    // Make the tree points green
    properties.Color = 'Green';
    properties.Size = properties.trunk_diameter;

    //* Create the final feature config and add the feature id for the ability to hover
    const feature = {
      type: 'Feature', geometry: { type: 'Point', coordinates }, properties,
    };
    geoJson.features.push(feature);
  }
  return geoJson;
};


export const rawKingstonDataToGeojsonData = (rawData, name = 'General', geojsonDataType = 'Point', color= null) => {
  try {
    //* Set initial Geojson element details
    const dataName = rawData.dataName || name;
    const dateTime = rawData.dateTime || uuidv4();
    const dataType = rawData.dataType || geojsonDataType;

    //* Create Geojson feature collection
    const geoJson = {
      type: 'FeatureCollection',
      dataName,
      dateTime,
      dataType,
      features: [],
    };
    //* For every bigquery row create a GEOJSON GPS element
    for (const gpsElement of rawData) {
      let coordinates = gpsElement.fields.geojson.coordinates || gpsElement.geometry.coordinates;


      const properties = gpsElement.fields;
      properties.Size = 1;

      //* If a color was not specified, generate a random color
      if(color){
        properties.Color = color;
      }
      else{
        let elementColor = (Math.floor(Math.random() * 16777215).toString(16)).toString();
        properties.Color = elementColor.length !== 6 ?   elementColor.padEnd(6, '0')  :`#${elementColor}`;
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

