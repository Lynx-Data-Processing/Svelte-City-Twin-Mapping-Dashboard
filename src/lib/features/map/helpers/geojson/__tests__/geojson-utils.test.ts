// tests/geojson.spec.ts
import { test, expect } from 'vitest'
import { POINT, LINE_STRING, MULTI_POINT, POLYGON, MULTI_LINE_STRING, MULTI_POLYGON } from "../../../constants/geojson"; // Update the import based on your actual file path
import { convertToGeojson, addAdditionalStylingToGeojson, convertGeoJSONToLatLng } from "../geojson-utils"; // Update the import based on your actual file path
import type { IGeojsonCollection, IGeojsonFeature } from '$lib/features/map/types';

test('convertToGeojson converts data to GeoJSON format', () => {
  const data = [
    { id: 1, location: { lat: 12, lng: 34 } },
    { id: 2, location: { lat: 56, lng: 78 } }
  ];
  const geojson = convertToGeojson(data, POINT);

  expect(geojson.type).toBe('FeatureCollection');
  expect(geojson.features.length).toBe(2);
  expect(geojson.features[0].geometry.type).toBe(POINT);
  expect(geojson.features[0].geometry.coordinates).toEqual([34, 12]);
});

test('addAdditionalStylingToGeojson adds styling', () => {
  const initialGeojson: IGeojsonCollection = {
    type: 'FeatureCollection',
    features: [ { type: 'Feature', properties: {}, geometry: { type: POINT, coordinates: [0, 0] } } ]
  };
  const styledGeojson = addAdditionalStylingToGeojson(initialGeojson, 'red', true);

  expect(styledGeojson.features[0].properties.color).toBe('red');
  expect(styledGeojson.features[0].properties.hasArrows).toBe(true);
});

test('convertGeoJSONToLatLng converts a GeoJSON feature to LatLng', () => {
  const geoJSONFeature: IGeojsonFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: POINT,
      coordinates: [34, 12]
    }
  };
  const latLng = convertGeoJSONToLatLng(geoJSONFeature);
  expect(latLng).toEqual({ lat: 12, lng: 34 });
});