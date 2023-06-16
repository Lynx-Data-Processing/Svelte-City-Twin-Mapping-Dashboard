import { convertTripsToGeoJSON } from '../../../lib/utils/geojson/geojson-trips-utils';
import { TRIPS_WITH_GPS } from '../../mocks/trips';

describe('converter', () => {
  test('convertToGeoJson', () => {
    const result = convertTripsToGeoJSON(TRIPS_WITH_GPS, "TestDevice");

    expect(result.dataName).toBe('GPS - TestDevice');
    expect(result.dataType).toBe('LineString');
    expect(result.dataSourceName).toBe('TestDevice');
    expect(result.hasFilter).toBe(false);

    // Test the first feature.
    expect(result.features[0].geometry.type).toBe('LineString');
    expect(result.features[0].properties).toHaveProperty('startTimestamp');
    expect(result.features[0].properties).toHaveProperty('endpointId');
  });

  // If you have additional mock data, you can add more tests here.
});
