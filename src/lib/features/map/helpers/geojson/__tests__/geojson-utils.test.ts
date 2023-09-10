// tests/geojson.spec.ts
import { test, expect } from 'vitest';
import { POINT, LINE_STRING, MULTI_POINT, POLYGON, MULTI_LINE_STRING, MULTI_POLYGON } from "../../../constants/geojson";
import { addAdditionalStylingToGeojson, convertGeoJSONToLatLng } from "../geojson-utils"; // Update the import based on your actual file path
import type { IGeojsonCollection, IGeojsonFeature } from '$lib/features/map/types/geojsonTypes';

test('convertGeoJSONToLatLng returns correct coordinates for POINT', () => {
  const geoJSON: IGeojsonFeature = {
    type: 'Feature',
    properties: {},
    geometry: { type: POINT, coordinates: [34, 12] }
  };
  expect(convertGeoJSONToLatLng(geoJSON)).toEqual({ lat: 12, lng: 34 });
});

test('convertGeoJSONToLatLng returns correct coordinates for LINE_STRING', () => {
  const geoJSON: IGeojsonFeature = {
    type: 'Feature',
    properties: {},
    geometry: { type: LINE_STRING, coordinates: [[34, 12], [56, 78]] }
  };
  expect(convertGeoJSONToLatLng(geoJSON)).toEqual({ lat: 12, lng: 34 });
});

test('convertGeoJSONToLatLng returns correct coordinates for MULTI_POINT', () => {
  const geoJSON: IGeojsonFeature = {
    type: 'Feature',
    properties: {},
    geometry: { type: MULTI_POINT, coordinates: [[34, 12], [56, 78]] }
  };
  expect(convertGeoJSONToLatLng(geoJSON)).toEqual({ lat: 12, lng: 34 });
});

test('convertGeoJSONToLatLng returns correct coordinates for POLYGON', () => {
  const geoJSON: IGeojsonFeature = {
    type: 'Feature',
    properties: {},
    geometry: { type: POLYGON, coordinates: [[[34, 12], [56, 78], [34, 12]]] }
  };
  expect(convertGeoJSONToLatLng(geoJSON)).toEqual({ lat: 12, lng: 34 });
});





test('addAdditionalStylingToGeojson adds default color when no color is passed', () => {
    const initialGeojson: IGeojsonCollection = {
      type: 'FeatureCollection',
      features: [ { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } } ]
    };
    const styledGeojson = addAdditionalStylingToGeojson(initialGeojson);
  
    expect(styledGeojson.features[0].properties.color).toBe("#000000");
  });
  
  test('addAdditionalStylingToGeojson adds specified color', () => {
    const initialGeojson: IGeojsonCollection = {
      type: 'FeatureCollection',
      features: [ { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } } ]
    };
    const styledGeojson = addAdditionalStylingToGeojson(initialGeojson, 'red');
  
    expect(styledGeojson.features[0].properties.color).toBe('red');
  });
  
  test('addAdditionalStylingToGeojson adds hasArrows property when specified', () => {
    const initialGeojson: IGeojsonCollection = {
      type: 'FeatureCollection',
      features: [ { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } } ]
    };
    const styledGeojson = addAdditionalStylingToGeojson(initialGeojson, 'red', true);
  
    expect(styledGeojson.features[0].properties.hasArrows).toBe(true);
  });
  
  test('addAdditionalStylingToGeojson does not add hasArrows property when not specified', () => {
    const initialGeojson: IGeojsonCollection = {
      type: 'FeatureCollection',
      features: [ { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } } ]
    };
    const styledGeojson = addAdditionalStylingToGeojson(initialGeojson, 'red');
  
    expect(styledGeojson.features[0].properties.hasArrows).toBeUndefined();
  });

test('convertGeoJSONToLatLng returns correct coordinates for MULTI_LINE_STRING', () => {
  const geoJSON: IGeojsonFeature = {
    type: 'Feature',
    properties: {},
    geometry: { type: MULTI_LINE_STRING, coordinates: [[[34, 12], [56, 78]]] }
  };
  expect(convertGeoJSONToLatLng(geoJSON)).toEqual({ lat: 12, lng: 34 });
});

test('convertGeoJSONToLatLng returns correct coordinates for MULTI_POLYGON', () => {
  const geoJSON: IGeojsonFeature = {
    type: 'Feature',
    properties: {},
    geometry: { type: MULTI_POLYGON, coordinates: [[[[34, 12], [56, 78], [34, 12]]]] }
  };
  expect(convertGeoJSONToLatLng(geoJSON)).toEqual({ lat: 12, lng: 34 });
});


test('convertGeoJSONToLatLng returns {lat: 0, lng: 0} for invalid input', () => {
  expect(convertGeoJSONToLatLng(null as any)).toEqual({ lat: 0, lng: 0 });
  expect(convertGeoJSONToLatLng(undefined as any)).toEqual({ lat: 0, lng: 0 });
});
