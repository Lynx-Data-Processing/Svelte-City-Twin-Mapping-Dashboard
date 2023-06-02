import { OPEN_DATA_KINGSTON_CITY_ZONES_URL, OPEN_DATA_KINGSTON_PLANNING_LINE_URL, OPEN_DATA_KINGSTON_TREES_URL } from '$lib/constants';
import { POLYGON } from '$lib/constants/geojson';
import { axiosCacheGetUtility } from '$lib/service/fetch-data';
import type { IGeojsonFeatureType, IGeojsonType } from '$lib/types/geojsonTypes';
import type { ILatLngType, ILayerListElementType } from '$lib/types/mapTypes';
import { getRandomColor } from '../color-utils';
import type { IGeojsonDataType } from './../../types/geojsonTypes';
import { createLayerElement, getInitialCoordinates } from './google-map-utils';




const getCoordinates = (coordinates: any) => {
  if (coordinates.length >= 2) {
    coordinates = coordinates.slice(0, 2);
  }
  return coordinates;
};


export const rawKingstonDataToGeojsonData = (rawData: any, geojsonDataType: IGeojsonDataType = "Point") => {

  //* Create Geojson feature collection
  const geoJson: IGeojsonType = {
    type: 'FeatureCollection',
    features: [],
  };

  for (let i = 0, len = rawData.length; i < len; i++) {

    try {
      const gpsElement = rawData[i];
      const properties = gpsElement.fields;

      let coordinates = getCoordinates(gpsElement.fields.geojson.coordinates);
      gpsElement.fields.Size = 1;
      properties.color = getRandomColor();

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
      'Polygon'
    );

    if (!neighborhoodsGpsData) return;

    const neighborhoodsElement = createLayerElement(Math.floor(Math.random() * 100), 'Neighborhoods', POLYGON, false, 'fa-solid fa-table-cells-large', 'Black', neighborhoodsGpsData);
    tempLayerList.push(neighborhoodsElement);
  } else {
    console.log(`Unable to load data for ${OPEN_DATA_KINGSTON_CITY_ZONES_URL}`);
  }



  return tempLayerList;
}

