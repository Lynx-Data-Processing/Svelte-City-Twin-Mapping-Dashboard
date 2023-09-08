export interface ILatLngType {
  lat: number,
  lng: number
}

export interface IMapDetailsType {
  zoom: number,
  mapTypeId: string,
  heading: number,
  tilt: number,
  center: ILatLngType,
  mapTypeControl: boolean,
  mapTypeControlOptions: {
    style: number,
    mapTypeIds: string[],
    position: number
  }
}
