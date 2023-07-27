import { OPEN_DATA_KINGSTON_BUS_ROUTES_URL, OPEN_DATA_KINGSTON_CITY_ZONES_URL, OPEN_DATA_KINGSTON_PLANNING_LINE_URL, OPEN_DATA_KINGSTON_PLANNING_POINT_URL, OPEN_DATA_KINGSTON_TREES_URL } from '$lib/constants';
import { LINE_STRING, POINT, POLYGON } from '$lib/constants/geojson';
import { KINGSTON_COORDINATES_ARRAY, OPEN_DATA_KINGSTON_CYCLING_PATHS_URL, OPEN_DATA_KINGSTON_WALKING_PATHS_URL } from '$lib/constants/kingston';
import { axiosCacheGetUtility } from '$lib/service/fetch-data';
import type { IGeojsonFeatureType, IGeojsonType } from '$lib/types/geojsonTypes';
import type { ILayerListElementType } from '$lib/types/mapTypes';
import { createLayerElement } from '../google/google-map-utils';
import type { IGeojsonDataType } from './../../types/geojsonTypes';
import { getColorGivenIndex } from './../color-utils';



const getCoords = (gpsElement: any) => {
  let coordinates = [];
  if (gpsElement.fields.geojson) {
    coordinates = gpsElement.fields.geojson.coordinates.slice(0, 2);
  } else if (gpsElement.fields.shape) {
    coordinates = gpsElement.fields.shape.coordinates[0];
  } else {
    coordinates = [KINGSTON_COORDINATES_ARRAY];
  }
  return coordinates;
}


export const rawKingstonDataToGeojsonData = (rawData: any, geojsonDataType: IGeojsonDataType = POINT) => {

  const geoJson: IGeojsonType = {
    type: 'FeatureCollection',
    features: [],
  };

  for (let i = 0, len = rawData.length; i < len; i++) {

    try {
      const gpsElement = rawData[i];
      const coordinates = getCoords(gpsElement);
      const properties = gpsElement.fields;
    
      delete gpsElement.fields.geojson
      delete gpsElement.fields.geo_point_2d
      delete gpsElement.fields.shape

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

const addAdditionalStylingToGeojson = (geojson: IGeojsonType, color?: string, hasArrows=false) => {
  for (let i = 0, len = geojson.features.length; i < len; i++) {
    geojson.features[i].properties.color = color || getColorGivenIndex(i);
    if (hasArrows) geojson.features[i].properties.hasArrows = true;
  }
  return geojson;
}


const getKingstonData = async (url: string) => {
  const response = await axiosCacheGetUtility(
    url
  );
  if (response.status === 200) {
    if (response.data.records.length) return response.data.records;
    return null;
  } else {
    return null;
  }
}


export const getKingstonMapData = async () => {
  const tempLayerList: ILayerListElementType[] = [];

  const neighborhoodsData = await getKingstonData(OPEN_DATA_KINGSTON_CITY_ZONES_URL);
  if (neighborhoodsData) {
    let neighborhoodsGpsData = rawKingstonDataToGeojsonData(neighborhoodsData, POLYGON);
    neighborhoodsGpsData = addAdditionalStylingToGeojson(neighborhoodsGpsData, '#000000');
    const neighborhoodsElement = createLayerElement('Neighborhoods', POLYGON, false, 'fa-solid fa-table-cells-large', 'Black', "https://cohousing.ca/wp-content/uploads/Kingston.jpg", neighborhoodsGpsData);
    tempLayerList.push(neighborhoodsElement);
  }

  // const planningPointData = await getKingstonData(OPEN_DATA_KINGSTON_PLANNING_POINT_URL);
  // if (planningPointData) {
  //   let planningPointGpsData = rawKingstonDataToGeojsonData(planningPointData, POINT,);
  //   planningPointGpsData = addAdditionalStylingToGeojson(planningPointGpsData, '#db3c30');
  //   const planningPointElement = createLayerElement('Construction Planning Points', POINT, false, 'fa-solid fa-road', '#db3c30', 'https://advancedct.com/wp-content/uploads/2021/09/shutterstock_92209726.jpg', planningPointGpsData);
  //   tempLayerList.push(planningPointElement);
  // }

  const busRoutesData = await getKingstonData(OPEN_DATA_KINGSTON_BUS_ROUTES_URL);
  if (busRoutesData) {
    let busRoutesGpsData = rawKingstonDataToGeojsonData(busRoutesData, LINE_STRING);
    busRoutesGpsData = addAdditionalStylingToGeojson(busRoutesGpsData, undefined, true);
    const busRoutesElement = createLayerElement('Bus Routes', LINE_STRING, false, 'fa-solid fa-bus', '#ffc107', 'https://www.kingstontransit.ca/images/kingston-transit-logo.png', busRoutesGpsData);
    tempLayerList.push(busRoutesElement);
  }

  const cyclingData = await getKingstonData(OPEN_DATA_KINGSTON_CYCLING_PATHS_URL);
  if (cyclingData) {
    let cyclingGpsData = rawKingstonDataToGeojsonData(cyclingData, LINE_STRING);
    cyclingGpsData = addAdditionalStylingToGeojson(cyclingGpsData, '#4caf50');
    const cyclingElement = createLayerElement('Cycling Paths', LINE_STRING, false, 'fa-solid fa-bicycle', '#4caf50', 'https://www.kingstontransit.ca/images/kingston-transit-logo.png', cyclingGpsData);
    tempLayerList.push(cyclingElement);
  }

  const walkingData = await getKingstonData(OPEN_DATA_KINGSTON_WALKING_PATHS_URL);
  if (walkingData) {
    let walkingGpsData = rawKingstonDataToGeojsonData(walkingData, POLYGON);
    walkingGpsData = addAdditionalStylingToGeojson(walkingGpsData, '#795548');
    const walkingElement = createLayerElement('Walking Paths', POLYGON, false, 'fa-solid fa-walking', '#795548', 'https://www.kingstontransit.ca/images/kingston-transit-logo.png', walkingGpsData);
    tempLayerList.push(walkingElement);
  }

  const traffic_lights = await axiosCacheGetUtility('/data/traffic_lights.json');
  if (traffic_lights.status === 200) {
    let trafficLightsGpsData = addAdditionalStylingToGeojson(traffic_lights.data, '#ff9800');
    const trafficLightsElement = createLayerElement('Traffic Lights', POINT, false, 'fa-solid fa-traffic-light', '#ff9800', 'https://www.kingstontransit.ca/images/kingston-transit-logo.png', trafficLightsGpsData);
    tempLayerList.push(trafficLightsElement);
  }

  // const stop_signs = await axiosCacheGetUtility('/data/stop_signs.json');
  // if (stop_signs.status === 200) {
  //   let stopSignsGpsData = addAdditionalStylingToGeojson(stop_signs.data, '#ff9800');
  //   const stopSignsElement = createLayerElement('Stop Signs', POINT, false, 'fa-solid fa-stop', '#ff9800', 'https://www.kingstontransit.ca/images/kingston-transit-logo.png', stopSignsGpsData);
  //   tempLayerList.push(stopSignsElement);
  // }

  return tempLayerList;
}

