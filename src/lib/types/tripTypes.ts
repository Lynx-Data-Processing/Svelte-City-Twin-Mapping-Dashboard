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
    tripEvents: any[];
    triggeredEvents: any[];
    geoPoints: { geo: { lon: number; lat: number }; timestamp: number }[];
    driverTripWithScore: any[];
  };
  