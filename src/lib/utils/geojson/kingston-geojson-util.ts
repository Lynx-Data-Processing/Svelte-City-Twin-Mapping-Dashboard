import { OPEN_DATA_KINGSTON_CITY_ZONES_URL, OPEN_DATA_KINGSTON_PLANNING_LINE_URL, OPEN_DATA_KINGSTON_TREES_URL } from '$lib/constants';
import { LINE_STRING, POINT, POLYGON } from '$lib/constants/geojson';
import { axiosCacheGetUtility } from '$lib/service/fetch-data';
import type { IGeojsonFeatureType, IGeojsonType } from '$lib/types/geojsonTypes';
import type { ILayerListElementType } from '$lib/types/mapTypes';
import type { IGeojsonDataType } from './../../types/geojsonTypes';
import { getColorGivenIndex } from './../color-utils';
import { createLayerElement } from './google-map-utils';




const getCoordinates = (coordinates: any) => {
  if (coordinates.length >= 2) {
    coordinates = coordinates.slice(0, 2);
  }
  return coordinates;
};


export const rawKingstonDataToGeojsonData = (rawData: any, geojsonDataType: IGeojsonDataType = POINT, color?: string) => {

  const geoJson: IGeojsonType = {
    type: 'FeatureCollection',
    features: [],
  };

  for (let i = 0, len = rawData.length; i < len; i++) {

    try {
      const gpsElement = rawData[i];
      const properties = gpsElement.fields;

      let coordinates = getCoordinates(gpsElement.fields.geojson.coordinates);
      properties.color = color || getColorGivenIndex(i);
      delete gpsElement.fields.geojson
      delete gpsElement.fields.geo_point_2d

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
    const neighborhoodsElement = createLayerElement('Neighborhoods', POLYGON, false, 'fa-solid fa-table-cells-large', 'Black', neighborhoodsGpsData);
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
    );

    if (!planningLineGpsData) return;

    const planningLineElement = createLayerElement('Planning Line', LINE_STRING, false, 'fa-solid fa-road', 'Black', planningLineGpsData);
    tempLayerList.push(planningLineElement);
  } else {
    console.log(`Unable to load data for ${OPEN_DATA_KINGSTON_PLANNING_LINE_URL}`);
  }



  return tempLayerList;
}

