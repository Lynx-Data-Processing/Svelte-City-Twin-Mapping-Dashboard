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


export const rawKingstonDataToGeojsonData = (rawData: any, geojsonDataType: IGeojsonDataType = POINT, color?: string, hasArrows = false) => {

  const geoJson: IGeojsonType = {
    type: 'FeatureCollection',
    features: [],
  };

  for (let i = 0, len = rawData.length; i < len; i++) {

    try {
      const gpsElement = rawData[i];
      const coordinates = getCoords(gpsElement);
      const properties = gpsElement.fields;
      properties.color = color || getColorGivenIndex(i);
      if (hasArrows) properties.hasArrows = true;

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
    const neighborhoodsGpsData = rawKingstonDataToGeojsonData(neighborhoodsData, POLYGON);
    const neighborhoodsElement = createLayerElement('Neighborhoods', POLYGON, false, 'fa-solid fa-table-cells-large', 'Black', "https://cohousing.ca/wp-content/uploads/Kingston.jpg", neighborhoodsGpsData);
    tempLayerList.push(neighborhoodsElement);
  }

  const planningLineData = await getKingstonData(OPEN_DATA_KINGSTON_PLANNING_LINE_URL);
  if (planningLineData) {
    const planningLineGpsData = rawKingstonDataToGeojsonData(planningLineData, LINE_STRING);
    const planningLineElement = createLayerElement('Construction Planning Lines', LINE_STRING, false, 'fa-solid fa-road', '#ff5722', 'https://advancedct.com/wp-content/uploads/2021/09/shutterstock_92209726.jpg', planningLineGpsData);
    tempLayerList.push(planningLineElement);
  }

  const planningPointData = await getKingstonData(OPEN_DATA_KINGSTON_PLANNING_POINT_URL);
  if (planningPointData) {
    const planningPointGpsData = rawKingstonDataToGeojsonData(planningPointData, POINT, "#db3c30");
    const planningPointElement = createLayerElement('Construction Planning Points', POINT, false, 'fa-solid fa-road', '#db3c30', 'https://advancedct.com/wp-content/uploads/2021/09/shutterstock_92209726.jpg', planningPointGpsData);
    tempLayerList.push(planningPointElement);
  }

  const busRoutesData = await getKingstonData(OPEN_DATA_KINGSTON_BUS_ROUTES_URL);
  if (busRoutesData) {
    const busRoutesGpsData = rawKingstonDataToGeojsonData(busRoutesData, LINE_STRING, undefined, true);
    const busRoutesElement = createLayerElement('Bus Routes', LINE_STRING, false, 'fa-solid fa-bus', '#ffc107', 'https://www.kingstontransit.ca/images/kingston-transit-logo.png', busRoutesGpsData);
    tempLayerList.push(busRoutesElement);
  }

  const cyclingData = await getKingstonData(OPEN_DATA_KINGSTON_CYCLING_PATHS_URL);
  if (cyclingData) {
    const cyclingGpsData = rawKingstonDataToGeojsonData(cyclingData, LINE_STRING, "#4caf50");
    const cyclingElement = createLayerElement('Cycling Paths', LINE_STRING, false, 'fa-solid fa-bicycle', '#4caf50', 'https://www.kingstontransit.ca/images/kingston-transit-logo.png', cyclingGpsData);
    tempLayerList.push(cyclingElement);
  }

  const walkingData = await getKingstonData(OPEN_DATA_KINGSTON_WALKING_PATHS_URL);
  if (walkingData) {
    const walkingGpsData = rawKingstonDataToGeojsonData(walkingData, POLYGON, "#795548");
    const walkingElement = createLayerElement('Walking Paths', POLYGON, false, 'fa-solid fa-walking', '#795548', 'https://www.kingstontransit.ca/images/kingston-transit-logo.png', walkingGpsData);
    tempLayerList.push(walkingElement);
  }

  return tempLayerList;
}

