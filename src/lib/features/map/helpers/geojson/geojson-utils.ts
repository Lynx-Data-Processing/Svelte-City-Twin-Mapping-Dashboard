import type { GeojsonGeometryType, IGeojsonCollection, IGeojsonFeature } from "../../types";
import { getColorGivenIndex } from "./color-utils";

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
    geojson.features[i].properties.color = color || getColorGivenIndex(i);
    if (hasArrows) geojson.features[i].properties.hasArrows = true;
  }
  return geojson;
}
