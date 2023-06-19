import type { IEventType } from "./eventTypes";

interface IGeoCoordinates {
  lon: number;
  lat: number;
}
export interface ITripEvent {
  id: string;
  endpointId: number;
  endpointName: string;
  startTimestamp: number;
  endTimestamp: number;
  tripStatus: string;
  startGeo: IGeoCoordinates;
  endGeo: IGeoCoordinates;
  distance: number;
}

export type ITripEventPoint = {
  tripEventType: string,
  geo: IGeoCoordinates,
  timestamp: number
}

export type ITrip = {
  id: string;
  endpointId: number;
  endpointName: string;
  startTimestamp: number;
  endTimestamp: number;
  tripStatus: string;
  startGeo: {
    lon: number;
    lat: number;
  };
  endGeo: {
    lon: number;
    lat: number;
  };
  distance: number;
  tripEvents: ITripEventPoint[];
  triggeredEvents: IEventType[];
  geoPoints?: { geo: { lon: number; lat: number }; timestamp: number }[];
  driverTripWithScore: any[];
};

