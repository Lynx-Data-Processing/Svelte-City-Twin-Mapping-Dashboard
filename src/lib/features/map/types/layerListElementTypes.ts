
import type { IGeojsonDataType, IGeojsonType } from "$lib/features/map/types/geojsonTypes";
import type { ILatLngType } from "$lib/features/map/types/googleTypes";



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

