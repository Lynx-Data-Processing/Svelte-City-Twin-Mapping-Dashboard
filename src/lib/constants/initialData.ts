import type { IMapDetailsType } from "$lib/types/mapTypes";
import type { ISearchParamType } from "$lib/types/types";


export const MAP_DATA : IMapDetailsType =  {
    mapTypeId: 'roadmap',
    center: { lng: -76.491143, lat: 44.231689 },
    zoom: 17,
    tilt: 60,
    heading: -17.6
};


export const SEARCH_PARAMS : ISearchParamType = {
    endpointId: 'John',
    limit: 20,
    offset: 0,
    startDateTime: '2023-06-14T00:00',
    endDateTime: '2023-06-15T23:00'
};