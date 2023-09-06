
import type { ILatLngType } from "$lib/features/map/types/googleTypes";
import type { IGeojsonDataType, IGeojsonType } from "../features/map/types/geojsonTypes";



export interface ILayerListElementType  {
    icon: string,
    type: IGeojsonDataType,
    isVisible: boolean,
    layerName: string,
    hasFilter?: boolean,
    sourceName: string,
    initialCoordinates?: ILatLngType,
    color?: string,
    geojson?: IGeojsonType,
    googleMapLayer?: any,
    layerImageUrl?: string
}

