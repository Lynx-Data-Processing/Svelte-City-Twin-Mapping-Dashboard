import type { IEventGoogleDataType, IEventType, ISensorDataType } from "$lib/types/eventTypes";
import type { IGeojsonDataType, IGeojsonFeatureType, IGeojsonType } from "$lib/types/geojsonTypes";
import type { ITrip, ITripGoogleDataType } from "$lib/types/tripTypes";
import axios from "axios";
import { getRandomColor, getRandomColorHEX } from "../color-utils";
import { groupByKey } from "../filter-data";

export const convertTripEventsPointsToGeojson = async (trip: ITrip, tripEventPoints: IEventType[]) => {
  let tripEventGeojsonList = []

  for (let i = 0, len = tripEventPoints.length; i < len; i++) {

    let event = tripEventPoints[i];

    //get object from array by key value
    // let event = tripEventPoints.find((o) => o.id === id);
    let sensorObject = event.snapshots.find((o) => o.source === "sensor");
    if (!sensorObject) continue;

    const response = await axios.get(sensorObject.downloadUrl);
    if (response.status !== 200 || !response.data) continue;
    if (!response.data.GEO_LOCATION) continue;
    let sensorData: ISensorDataType = response.data as ISensorDataType;
    let coord = [parseFloat(sensorData.GEO_LOCATION.longitude), parseFloat(sensorData.GEO_LOCATION.latitude)];

    const properties: IEventGoogleDataType = {
      ...event,
      ...sensorData,
      ...trip,
      type: "TRIP_EVENT",
      color: '#f13031',
      size: 7
    }


    const point: IGeojsonFeatureType = {
      type: "Feature",
      properties: properties,
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

  let geoJsonArray: IGeojsonType[] = [];

  for (let i = 0, len = trips.length; i < len; i++) {
    try {
      const trip = trips[i];

      const color = getRandomColor();
      const geoJson: IGeojsonType = {
        name: `${trip.endpointName}_${i}_trip`,
        color : color,
        isTrip: true,
        type: 'FeatureCollection',
        features: [],
      };

      const geoJsonEvents: IGeojsonType = {
        name:  `${trip.endpointName}_${i}_events`,
        isTrip: false,
        type: 'FeatureCollection',
        features: [],
        color: '#f13031'
      };


      const points = trip.geoPoints.map((point) => [point.geo.lon, point.geo.lat]);
      
      const props : ITripGoogleDataType ={
        ...trip,
        type: "TRIP",
        color: color,
        size: 7

      }
      
      const feature: IGeojsonFeatureType = {
        type: "Feature",
        properties: props,
        geometry: {
          type: geojsonDataType,
          coordinates: points,
        },
      };


      let pointsList: IGeojsonFeatureType[] = []
      let startPoint = points[0];
      let endPoint = points[points.length - 1];
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

      geoJson.features.push(feature, ...pointsList);
      geoJsonArray.push(geoJson);

      if (trip.triggeredEvents) {
        const eventTrips = await convertTripEventsPointsToGeojson(trip, trip.triggeredEvents);
        if (eventTrips.length <= 0) continue;
        geoJsonEvents.features.push(...eventTrips);
        geoJsonArray.push(geoJsonEvents);
      }



    } catch (err) {
      console.error(err)
    }


  }
  return geoJsonArray;
}
