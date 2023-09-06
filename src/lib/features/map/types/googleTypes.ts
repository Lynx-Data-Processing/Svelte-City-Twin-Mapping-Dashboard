import type { TRIP, TRIP_EVENT } from "$lib/constants";
import type { IEventType, ISensorDataType } from "../../../types/eventTypes";
import type { ITrip } from "../../../types/tripTypes";

export type ITripEventType =  typeof TRIP | typeof TRIP_EVENT ;
export interface IEventGoogleDataType extends IEventType, ISensorDataType, ITrip {
  type: ITripEventType
  color: string
  size: number
}


export interface ITripGoogleDataType extends ITrip {
    type: ITripEventType
    color: string
    size: number
  }