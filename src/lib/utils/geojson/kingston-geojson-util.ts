import { KINGSTON_COORDINATES_ARRAY } from '$lib/constants/kingston';
import { OPEN_DATA_KINGSTON_BUS_ROUTES_URL, OPEN_DATA_KINGSTON_CITY_ZONES_URL, OPEN_DATA_KINGSTON_PLANNING_LINE_URL, OPEN_DATA_KINGSTON_PLANNING_POINT_URL, OPEN_DATA_KINGSTON_TREES_URL } from '$lib/constants';
import { LINE_STRING, POINT, POLYGON } from '$lib/constants/geojson';
import { axiosCacheGetUtility } from '$lib/service/fetch-data';
import type { IGeojsonFeatureType, IGeojsonType } from '$lib/types/geojsonTypes';
import type { ILayerListElementType } from '$lib/types/mapTypes';
import type { IGeojsonDataType } from './../../types/geojsonTypes';
import { getColorGivenIndex } from './../color-utils';
import { createLayerElement } from './google-map-utils';




const getGeojsonCoordinates = (coordinates: any) => {
  if (coordinates.length >= 2) {
    coordinates = coordinates.slice(0, 2);
  }
  return coordinates;
};

const getCoords = (gpsElement: any) => {
  let coordinates = [];
  if (gpsElement.fields.geojson) {
    coordinates = getGeojsonCoordinates(gpsElement.fields.geojson.coordinates);
  }
  else if (gpsElement.fields.shape) {
    coordinates = gpsElement.fields.shape.coordinates[0];
  } else {
    coordinates = [KINGSTON_COORDINATES_ARRAY]
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
      if (hasArrows) {
        properties.hasArrows = true;
      }
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



export const getKingstonMapData = async () => {
  const tempLayerList: ILayerListElementType[] = [];

  const neighborhoodsResponse = await axiosCacheGetUtility(
    OPEN_DATA_KINGSTON_CITY_ZONES_URL
  );
  if (neighborhoodsResponse.status === 200) {
    const neighborhoodsData = neighborhoodsResponse.data.records;
    if (!neighborhoodsData.length) return;
    const neighborhoodsGpsData = rawKingstonDataToGeojsonData(
      neighborhoodsData,
      POLYGON
    );

    if (!neighborhoodsGpsData) return;
    const neighborhoodsElement = createLayerElement('Neighborhoods', POLYGON, false, 'fa-solid fa-table-cells-large', 'Black', "https://cohousing.ca/wp-content/uploads/Kingston.jpg", neighborhoodsGpsData);
    tempLayerList.push(neighborhoodsElement);
  } else {
    console.log(`Unable to load data for ${OPEN_DATA_KINGSTON_CITY_ZONES_URL}`);
  }


  const planningLineResponse = await axiosCacheGetUtility(
    OPEN_DATA_KINGSTON_PLANNING_LINE_URL
  );

  if (planningLineResponse.status === 200) {
    const planningLineData = planningLineResponse.data.records;
    if (!planningLineData.length) return;

    const planningLineGpsData = rawKingstonDataToGeojsonData(
      planningLineData,
      LINE_STRING,
      "#ff5722"
    );

    if (!planningLineGpsData) return;

    const planningLineElement = createLayerElement('Construction Planning Lines', LINE_STRING, false, 'fa-solid fa-road', '#ff5722', 'https://advancedct.com/wp-content/uploads/2021/09/shutterstock_92209726.jpg', planningLineGpsData);
    tempLayerList.push(planningLineElement);
  } else {
    console.log(`Unable to load data for ${OPEN_DATA_KINGSTON_PLANNING_LINE_URL}`);
  }

  const planningPointResponse = await axiosCacheGetUtility(
    OPEN_DATA_KINGSTON_PLANNING_POINT_URL
  );

  if (planningPointResponse.status === 200) {
    const planningPointData = planningPointResponse.data.records;
    if (!planningPointData.length) return;

    const planningPointGpsData = rawKingstonDataToGeojsonData(
      planningPointData,
      POINT,
      '#ff9800'
    );

    if (!planningPointGpsData) return;

    const planningPointElement = createLayerElement('Construction Planning Point', POINT, false, 'fa-solid fa-map-marker', '#ff9800', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrQdis5OOgQebZ1P-AmscP92aCToDCbbBwGw&usqp=CAU', planningPointGpsData);
    tempLayerList.push(planningPointElement);
  } else {
    console.log(`Unable to load data for ${OPEN_DATA_KINGSTON_PLANNING_POINT_URL}`);
  }


  const busRouteResponse = await axiosCacheGetUtility(
    OPEN_DATA_KINGSTON_BUS_ROUTES_URL
  );

  if (busRouteResponse.status === 200) {
    const busRouteData = busRouteResponse.data.records;
    if (!busRouteData.length) return;

    const busRouteGpsData = rawKingstonDataToGeojsonData(
      busRouteData,
      LINE_STRING,
      undefined,
      true
    );

    if (!busRouteGpsData) return;

    const busRouteElement = createLayerElement('Bus Routes', LINE_STRING, false, 'fa-solid fa-bus', '#2196f3', 'https://www.kingstonist.com/wp-content/uploads/2021/07/228193978_1542240666127179_4009091391609494196_n.jpg', busRouteGpsData);
    tempLayerList.push(busRouteElement);
  } else {
    console.log(`Unable to load data for ${OPEN_DATA_KINGSTON_BUS_ROUTES_URL}`);
  }




  return tempLayerList;
}

