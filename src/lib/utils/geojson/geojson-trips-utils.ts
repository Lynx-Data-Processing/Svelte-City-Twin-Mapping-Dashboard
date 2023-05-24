import type { IGeojsonDataType, IGeojsonFeatureType, IGeojsonType } from "$lib/types/geojsonTypes";
import type { ITrip } from "$lib/types/tripTypes";

export function convertTripsToGeoJSON(trips: ITrip[], deviceId: string): IGeojsonType {
    const dataName = `GPS - ${deviceId}`;
    const dateTime = new Date().toISOString();
    const dataType: IGeojsonDataType = "LineString";
    const hasFilter = false;
    const dataSourceName = deviceId;
  
    const geoJson: IGeojsonType = {
      type: 'FeatureCollection',
      dataName,
      dateTime,
      dataType,
      dataSourceName,
      hasFilter,
      features: [],
    };
  
    for (const trip of trips) {
      const points = trip.geoPoints.map((point) => [point.geo.lon, point.geo.lat]);
      const feature : IGeojsonFeatureType = {
        type: "Feature",
        properties: {
          id: trip.id,
          endpointId: trip.endpointId,
          endpointName: trip.endpointName,
          startTimestamp: trip.startTimestamp,
          endTimestamp: trip.endTimestamp,
          tripStatus: trip.tripStatus,
          distance: trip.distance,
        },
        geometry: {
          type: "LineString",
          coordinates: points,
        },
      };
      geoJson.features.push(feature);
    }
  
    return geoJson;
  }