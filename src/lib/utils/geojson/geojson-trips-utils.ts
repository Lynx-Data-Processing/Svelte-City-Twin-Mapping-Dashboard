import type { IGeojsonDataType, IGeojsonFeatureType, IGeojsonType } from "$lib/types/geojsonTypes";
import type { ITrip } from "$lib/types/tripTypes";
import { getRandomColorHEX } from "../color-utils";
import { groupByKey } from "../filter-data";


//* To use the data on mapbox, the data must be in GEOJSON format
export const convertTripsToGeoJSON = async (trips: ITrip[], geojsonDataType: IGeojsonDataType = "LineString") => {
  const groupedTrips = groupByKey(trips, 'endpointName');
  let geoJsonArray: IGeojsonType[] = [];

  for (const [deviceId, tripList] of Object.entries(groupedTrips)) {
    try {

      let tripsWithGPS = tripList as ITrip[];
      const geoJson: IGeojsonType = {
        type: 'FeatureCollection',
        features: [],
      };

      for (const trip of tripsWithGPS) {
        const points = trip.geoPoints.map((point) => [point.geo.lon, point.geo.lat]);
        const feature: IGeojsonFeatureType = {
          type: "Feature",
          properties: {
            id: trip.id,
            endpointId: trip.endpointId,
            endpointName: trip.endpointName,
            startTimestamp: trip.startTimestamp,
            endTimestamp: trip.endTimestamp,
            tripStatus: trip.tripStatus,
            distance: trip.distance,
            color: getRandomColorHEX(),

          },
          geometry: {
            type: geojsonDataType,
            coordinates: points,
          },
        };
        geoJson.features.push(feature);
      }

      geoJsonArray.push(geoJson);

    }
    catch (err) {
      console.error(err)
    }
  }
  return geoJsonArray;
}
