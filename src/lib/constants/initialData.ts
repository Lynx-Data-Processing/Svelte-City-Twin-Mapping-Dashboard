
import type { IMapDetailsType } from "$lib/features/map/types";
import type { ISearchParamType } from "$lib/features/menu/types";
import { KINGSTON_COORDINATES_OBJ } from "../features/map/constants/kingston";


export const MAP_DATA : IMapDetailsType =  {
    mapTypeId: 'roadmap',
    center: KINGSTON_COORDINATES_OBJ,
    zoom: 17,
    tilt: 60,
    heading: -17.6
};


export const SEARCH_PARAMS : ISearchParamType = {
    endpointId: 'John',
    limit: 20,
    offset: 0,
    showEvents: true,
    useRealData: false,
    startDateTime: '2023-06-04',
    endDateTime: '2023-06-17'
};