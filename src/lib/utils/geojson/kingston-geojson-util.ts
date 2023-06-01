import { OPEN_DATA_KINGSTON_CITY_ZONES_URL, OPEN_DATA_KINGSTON_PLANNING_LINE_URL, OPEN_DATA_KINGSTON_TREES_URL } from '$lib/constants';
import { axiosCacheGetUtility } from '$lib/service/fetch-data';
import type { IGeojsonFeatureType, IGeojsonType } from '$lib/types/geojsonTypes';
import type { ILatLngType, ILayerListElementType } from '$lib/types/mapTypes';
import { getRandomColor } from '../color-utils';
import type { IGeojsonDataType } from './../../types/geojsonTypes';


export const getInitialCoordinates = (type: IGeojsonDataType, data: any): ILatLngType => {
  if (!data) return { lat: 0, lng: 0 };

  const initialCoordinateMap: { [key in IGeojsonDataType]?: number[] } = {
    Point: data.features[0].geometry.coordinates,
    LineString: data.features[0].geometry.coordinates[0],
    Polygon: data.features[0].geometry.coordinates[0][0],
    MultiPolygon: data.features[0].geometry.coordinates[0][0],
  };

  const coords = initialCoordinateMap[type];
  if (coords && coords.length >= 2) {
    return { lat: coords[1], lng: coords[0] };
  }

  return { lat: 0, lng: 0 };
};

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

    const neighborhoodsElement: ILayerListElementType = {
      id: Math.floor(Math.random() * 100),
      icon: 'fa-solid fa-table-cells-large',
      type: 'Polygon',
      isVisible: false,
      layerName: 'Neighborhoods',
      hasFilter: false,
      sourceName: 'NeighborhoodsSource',
      initialCoordinates: getInitialCoordinates('Polygon', neighborhoodsGpsData),
      color: 'Blue',
      geojson: neighborhoodsGpsData
    };
    tempLayerList.push(neighborhoodsElement);
  } else {
    console.log(`Unable to load data for ${OPEN_DATA_KINGSTON_CITY_ZONES_URL}`);
  }


  const kingstonTreesResponse = await axiosCacheGetUtility(
    OPEN_DATA_KINGSTON_TREES_URL
  );
  if (kingstonTreesResponse.status === 200) {
    const kingstonTreesData = kingstonTreesResponse.data.records;
    if (!kingstonTreesData.length) return;

    const kingstonTreesGpsData = rawKingstonDataToGeojsonData(
      kingstonTreesData,
      'Point'
    );

    if (!kingstonTreesGpsData) return;

    const kingstonTreesElement: ILayerListElementType = {
      id: Math.floor(Math.random() * 100),

      icon: 'fa-solid fa-tree',
      type: 'Point',
      isVisible: false,
      layerName: 'Kingston Trees',
      hasFilter: false,
      sourceName: 'KingstonTreesSource',
      initialCoordinates: getInitialCoordinates('Point', kingstonTreesGpsData),
      color: 'Green',
      geojson: kingstonTreesGpsData
    };
    tempLayerList.push(kingstonTreesElement);
  } else {
    console.log(`Unable to load data for ${OPEN_DATA_KINGSTON_TREES_URL}`);
  }

  return tempLayerList;
}

