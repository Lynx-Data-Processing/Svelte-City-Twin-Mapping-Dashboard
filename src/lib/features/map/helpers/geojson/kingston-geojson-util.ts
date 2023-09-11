
import { LINE_STRING, POINT, POLYGON } from '$lib/features/map/constants/geojson';
import { KINGSTON_COORDINATES_ARRAY, OPEN_DATA_KINGSTON_BUS_ROUTES_URL, OPEN_DATA_KINGSTON_CITY_ZONES_URL, OPEN_DATA_KINGSTON_CYCLING_PATHS_URL, OPEN_DATA_KINGSTON_WALKING_PATHS_URL } from '$lib/features/map/constants/kingston';
import { axiosCacheGetUtility } from '$lib/features/map/services/fetch-data';
import type { GeojsonGeometryType, IGeojsonCollection, IGeojsonFeature, IMapLayer } from '$lib/features/map/types';
import { createMapLayer } from '../google/google-map-utils';
import { addAdditionalStylingToGeojson } from './geojson-utils';



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

//* This is similar to the Geojson function in the geojson-utils.ts file, but this one is specific to the Kingston Open Data API as it has a completely different structure
export const rawKingstonDataToGeojsonData = (rawData: any, geojsonDataType: GeojsonGeometryType = POINT) => {

  const geoJson: IGeojsonCollection = {
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

      const feature: IGeojsonFeature = {
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
  const tempLayerList: IMapLayer[] = [];

  const neighborhoodsData = await getKingstonData(OPEN_DATA_KINGSTON_CITY_ZONES_URL);
  if (neighborhoodsData) {
    let neighborhoodsGpsData = rawKingstonDataToGeojsonData(neighborhoodsData, POLYGON);
    neighborhoodsGpsData = addAdditionalStylingToGeojson(neighborhoodsGpsData, undefined);
    const neighborhoodsElement = createMapLayer('Neighborhoods', POLYGON, false, 'fa-solid fa-table-cells-large', 'Black', neighborhoodsGpsData);
    tempLayerList.push(neighborhoodsElement);
  }

  const busRoutesData = await getKingstonData(OPEN_DATA_KINGSTON_BUS_ROUTES_URL);
  if (busRoutesData) {
    let busRoutesGpsData = rawKingstonDataToGeojsonData(busRoutesData, LINE_STRING);
    busRoutesGpsData = addAdditionalStylingToGeojson(busRoutesGpsData, undefined, true);
    const busRoutesElement = createMapLayer('Bus Routes', LINE_STRING, false, 'fa-solid fa-bus', '#ffc107',  busRoutesGpsData);
    tempLayerList.push(busRoutesElement);
  }

  const cyclingData = await getKingstonData(OPEN_DATA_KINGSTON_CYCLING_PATHS_URL);
  if (cyclingData) {
    let cyclingGpsData = rawKingstonDataToGeojsonData(cyclingData, LINE_STRING);
    cyclingGpsData = addAdditionalStylingToGeojson(cyclingGpsData, '#4caf50');
    const cyclingElement = createMapLayer('Cycling Paths', LINE_STRING, false, 'fa-solid fa-bicycle', '#4caf50', cyclingGpsData);
    tempLayerList.push(cyclingElement);
  }

  // const walkingData = await getKingstonData(OPEN_DATA_KINGSTON_WALKING_PATHS_URL);
  // if (walkingData) {
  //   let walkingGpsData = rawKingstonDataToGeojsonData(walkingData, POLYGON);
  //   walkingGpsData = addAdditionalStylingToGeojson(walkingGpsData, '#795548');
  //   const walkingElement = createMapLayer('Walking Paths', POLYGON, false, 'fa-solid fa-walking', '#795548', walkingGpsData);
  //   tempLayerList.push(walkingElement);
  // }

  // const traffic_lights = await axiosCacheGetUtility('/data/traffic_lights.json');
  // if (traffic_lights.status === 200) {
  //   let trafficLightsGpsData = addAdditionalStylingToGeojson(traffic_lights.data, '#ff9800');
  //   const trafficLightsElement = createMapLayer('Traffic Lights', POINT, false, 'fa-solid fa-traffic-light', '#ff9800', trafficLightsGpsData);
  //   tempLayerList.push(trafficLightsElement);
  // }

  return tempLayerList;
}

