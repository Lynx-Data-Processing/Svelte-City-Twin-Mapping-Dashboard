import type { IEventType, ISensorDataType } from "$lib/types/eventTypes";
import type { IGeojsonDataType, IGeojsonFeatureType, IGeojsonType } from "$lib/types/geojsonTypes";
import type { ITrip } from "$lib/types/tripTypes";
import axios from "axios";
import { getRandomColor, getRandomColorHEX } from "../color-utils";
import { groupByKey } from "../filter-data";

export const convertTripEventsPointsToGeojson = async (tripEventPoints: IEventType[]) => {
  let tripEventGeojsonList = []

  for (let i = 0, len = tripEventPoints.length; i < len; i++) {
    
      let event = tripEventPoints[i];
      const response = await axios.get(event.snapshots[1].downloadUrl);
      if (response.status !== 200 || !response.data) continue;
      if(!response.data.GEO_LOCATION) continue;
      let sensorData : ISensorDataType = response.data as ISensorDataType;
      let coord = [parseFloat(sensorData.GEO_LOCATION.longitude), parseFloat(sensorData.GEO_LOCATION.latitude)];
      const point: IGeojsonFeatureType = {
        type: "Feature",
        properties: { ...event, image_1: event.snapshots[0].downloadUrl, image_2: event.snapshots[2].downloadUrl, isEvent: true, color: '#f03132', size: 7},
        geometry: {
          type: "Point",
          coordinates: coord
        }
      };

      tripEventGeojsonList.push(point)
    
   
  }

  return tripEventGeojsonList;
}


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


        if (trip.tripEvents) {
          const eventTrips = await convertTripEventsPointsToGeojson(trip.triggeredEvents);
          pointsList.push(...eventTrips)
        }

        geoJson.features.push(feature, ...pointsList);
      }

      geoJsonArray.push(geoJson);

    } catch (err) {
      console.error(err)
    }
  }
  return geoJsonArray;
}
