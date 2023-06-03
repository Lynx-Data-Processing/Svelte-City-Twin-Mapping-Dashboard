import type { IEventType } from "$lib/types/eventTypes";
import type { IGeojsonDataType, IGeojsonFeatureType, IGeojsonType } from "$lib/types/geojsonTypes";
import type { ITrip } from "$lib/types/tripTypes";
import { getRandomColor, getRandomColorHEX } from "../color-utils";
import { groupByKey } from "../filter-data";

// export const convertTripEventsPointsToGeojson = (tripEventPoints: IEventType[]) => {
//   let tripEventGeojsonList = []

//   for (let i = 0, len = tripEventPoints.length; i < len; i++) {
//     let event = tripEventPoints[i];
//     if(!event.geo) continue;
//     let coord = [event.geo.lon, event.geo.lat];
//     const point: IGeojsonFeatureType = {
//       type: "Feature",
//       properties: { id: "Event", "Event Type": event.tripEventType, color: "red" },
//       geometry: {
//         type: "Point",
//         coordinates: coord
//       }
//     };

//     tripEventGeojsonList.push(point)
//   }

//   return tripEventGeojsonList;
// }

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
            color: getRandomColor(),

          },
          geometry: {
            type: geojsonDataType,
            coordinates: points,
          },
        };


        let pointsList: IGeojsonFeatureType[] = []
        let startPoint = points[0];
        let endPoint = points[points.length - 1];
        // Add circles at the start and end of each feature

        if (startPoint) {
          const startCircle: IGeojsonFeatureType = {
            type: "Feature",
            properties: { ...feature.properties, id: feature.properties.id + '_start' },
            geometry: {
              type: "Point",
              coordinates: startPoint,
            }
          };
          pointsList.push(startCircle)
        }

        if (endPoint) {
          const endCircle: IGeojsonFeatureType = {
            type: "Feature",
            properties: { ...feature.properties, id: feature.properties.id + '_end' },
            geometry: {
              type: "Point",
              coordinates: endPoint
            }
          };
          pointsList.push(endCircle)
        }


        // if(trip.tripEvents){
        //   const eventTrips = convertTripEventsPointsToGeojson(trip.triggeredEvents);
        //   pointsList.push(...eventTrips)
        // }

        geoJson.features.push(feature, ...pointsList);
      }

      geoJsonArray.push(geoJson);

    } catch (err) {
      console.error(err)
    }
  }
  return geoJsonArray;
}
