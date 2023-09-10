import { LINE_STRING, MULTI_LINE_STRING, MULTI_POINT, MULTI_POLYGON, POINT, POLYGON } from "../../constants/geojson";
import type { GeojsonGeometryType, IGeojsonCollection, IGeojsonFeature, ILatLngType } from "../../types";

//* All elements must have a lng and lat property otherwise it will not be converted
export const convertToGeojson = (data: any[], geojsonGeometryType: GeojsonGeometryType) => {

  let geojsonCollection: IGeojsonCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  for (let i = 0, len = data.length; i < len; i++) {
    try {
      const element = data[i];
      if (!element.location) continue;

      const feature: IGeojsonFeature = {
        type: 'Feature',
        properties: { ...element },
        geometry: {
          type: geojsonGeometryType,
          coordinates: [element.location.lng, element.location.lat]
        }
      };

      geojsonCollection.features.push(feature);
    } catch (err) {
      console.error(err);
      continue;
    }
  }

  return geojsonCollection;
}

export const addAdditionalStylingToGeojson = (geojson: IGeojsonCollection, color?: string, hasArrows = false) => {
  for (let i = 0, len = geojson.features.length; i < len; i++) {
    geojson.features[i].properties.color = color || "#000000";
    if (hasArrows) geojson.features[i].properties.hasArrows = true;
  }
  return geojson;
}

export function convertGeoJSONToLatLng(geoJSON: IGeojsonFeature): ILatLngType  {
  if (!geoJSON || !geoJSON.geometry || !geoJSON.geometry.type) {
    return {lat: 0, lng: 0}; // Return null if the input doesn't look like a GeoJSON object
  }

  let firstCoordinate: number[];

  switch (geoJSON.geometry.type) {
    case POINT:
      firstCoordinate = geoJSON.geometry.coordinates as number[];
      break;
    case LINE_STRING:
    case MULTI_POINT:
      firstCoordinate = (geoJSON.geometry.coordinates as number[][])[0];
      break;
    case POLYGON:
    case MULTI_LINE_STRING:
      firstCoordinate = (geoJSON.geometry.coordinates as number[][][])[0][0];
      break;
    case MULTI_POLYGON:
      firstCoordinate = (geoJSON.geometry.coordinates as number[][][][])[0][0][0];
      break;
    default:
      return {lat: 0, lng: 0}; // Unsupported GeoJSON type
  }

  if (!firstCoordinate || firstCoordinate.length < 2) {
    return {lat: 0, lng: 0}; // Return null if the coordinates are not as expected
  }

  const coords = {
    lat: firstCoordinate[1],
    lng: firstCoordinate[0]
  };
  return coords;

}