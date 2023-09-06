
import type { GeojsonGeometryType, IGeojsonCollection } from "$lib/features/map/types/geojsonTypes";
import type { ILatLngType } from "$lib/features/map/types/googleTypes";

export interface IMapLayer  {
    icon: string,
    type: GeojsonGeometryType,
    isVisible: boolean,
    layerName: string,
    hasFilter?: boolean,
    sourceName: string,
    initialCoordinates?: ILatLngType,
    color?: string,
    geojson?: IGeojsonCollection,
    googleMapLayer?: any,
    layerImageUrl?: string
}

export interface ISeachParameters {
    dateStart: string,
    dateEnd: string,
    location: any,
    model: string,
    returnVideo: boolean
}