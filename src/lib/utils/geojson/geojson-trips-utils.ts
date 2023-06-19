import { FEATURE, FEATURE_COLLECTION, LINE_STRING, POINT, TRIP, TRIP_EVENT } from "$lib/constants";

import type { IGeojsonFeatureType, IGeojsonType } from "$lib/types/geojsonTypes";
import type { ILayerListElementType } from "$lib/types/mapTypes";
import type { ITrip } from "$lib/types/tripTypes";
import axios from "axios";
import { getRandomColor } from "../color-utils";
import { createLayerElement } from "../google/google-map-utils";
import type { ISensorDataType } from "$lib/types/eventTypes";
import type { IEventGoogleDataType, ITripGoogleDataType } from "$lib/types/googleTypes";

export const convertTripEventsPointsToGeojson = async (trip: ITrip, eventColor: string) => {
  let tripEventGeojsonList: IGeojsonFeatureType[] = []
  const triggeredEvents = trip.triggeredEvents;
  for (let i = 0, len = triggeredEvents.length; i < len; i++) {
    let event = triggeredEvents[i];
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
      type: TRIP_EVENT,
      color: eventColor,
      size: 7
    }
    const eventPointGeojson: IGeojsonFeatureType = {
      type: FEATURE,
      properties: properties,
      geometry: {
        type: POINT,
        coordinates: coord
      }
    };
    tripEventGeojsonList.push(eventPointGeojson)
  }
  return tripEventGeojsonList;
}

export const convertTripToGeoJSON = async (trip: ITrip, tripColor: string) => {
  const geoJson: IGeojsonType = {
    type: FEATURE_COLLECTION,
    features: [],
  };

  const tripCoordinates = trip.geoPoints!.map((point) => [point.geo.lon, point.geo.lat]);
  delete trip.geoPoints;

  const tripProperties: ITripGoogleDataType = {
    ...trip,
    type: TRIP,
    color: tripColor,
    size: 7,
  }

  const feature: IGeojsonFeatureType = {
    type: FEATURE,
    properties: tripProperties,
    geometry: {
      type: LINE_STRING,
      coordinates: tripCoordinates,
    },
  };

  geoJson.features.push(feature);
  return geoJson;
}

const createEventsGeojson = async (trip: ITrip, eventColor: string) => {
  const eventGeojson: IGeojsonType = {
    type: FEATURE_COLLECTION,
    features: [],
  };

  const eventTrips = await convertTripEventsPointsToGeojson(trip, eventColor);
  eventGeojson.features.push(...eventTrips);
  return eventGeojson;
}

export const convertTripsToLayerListElements = async (trips: ITrip[], showEvents: boolean = true) => {
  const tempLayerListElements: ILayerListElementType[] = [];
  for (let i = 0, len = trips.length; i < len; i++) {
    const trip = trips[i];

    if (trip.geoPoints) {
      const tripColor = getRandomColor();
      const tripGeojson = await convertTripToGeoJSON(trip, tripColor);
      const tripLayerElement = createLayerElement(`Trips - ${trip.id}`, LINE_STRING, true, 'fa fa-route', tripColor, '', tripGeojson);
      tempLayerListElements.push(tripLayerElement);
    }

    if (trip.triggeredEvents && trip.triggeredEvents.length > 0 && showEvents) {
      const eventColor = "#f13031"
      const eventGeojson = await createEventsGeojson(trip, eventColor);
      const eventLayerElement = createLayerElement(`Events - ${trip.id} `, POINT, true, 'fa fa-exclamation-triangle', eventColor, '', eventGeojson);
      tempLayerListElements.push(eventLayerElement);
    }
  }

  return tempLayerListElements;
}
