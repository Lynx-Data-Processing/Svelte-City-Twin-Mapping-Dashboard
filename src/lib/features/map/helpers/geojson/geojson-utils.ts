import type { GeojsonGeometryType, IGeojsonCollection, IGeojsonFeature } from "../../types";

//* All elements must have a lng and lat property otherwise it will not be converted
export const convertToGeojson = (data: any[], geojsonGeometryType: GeojsonGeometryType) => {

  let geojsonCollection: IGeojsonCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  for (let i = 0, len = data.length; i < len; i++) {
    try {
      const element = data[i];
      if (!element.lng || !element.lat) continue;

      const feature: IGeojsonFeature = {
        type: 'Feature',
        properties: { ...element },
        geometry: {
          type: geojsonGeometryType,
          coordinates: [element.lng, element.lat]
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