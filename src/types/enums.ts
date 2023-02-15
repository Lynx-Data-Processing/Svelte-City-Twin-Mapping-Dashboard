export enum GeojsonEnum {
    Point = 'Point',
    MultiPoint = 'MultiPoint',
    LineString = 'LineString',
    MultiLineString = 'MultiLineString',
    Polygon = 'Polygon',
    MultiPolygon = 'MultiPolygon',
    GeometryCollection = 'GeometryCollection',
    Feature = 'Feature',
    FeatureCollection = 'FeatureCollection'
}

export enum GeojsonDataEnum {
    GPS = 'GPS',
    Neighbourhoods = 'Neighbourhoods',
    Trees = 'Trees',
    Building = 'Building',
}


export enum FontAwesomeIconGivenGeojsonEnum {
    Point = 'fa-sharp fa-solid fa-circle',
    MultiPoint = 'fa-sharp fa-solid fa-circle',
    LineString = 'fa-solid fa-grip-lines',
    MultiLineString = 'fa-solid fa-grip-lines',
    Polygon = 'fa-solid fa-square',
    MultiPolygon = 'fa-solid fa-square',
    GeometryCollection = 'fa-solid fa-square',
    Feature = 'fa-solid fa-map',
    FeatureCollection = 'fa-solid fa-square',
}

export enum TimeStampFormatEnum {
    YYYY_MM_DD_hh_mm_ss = 'yyyy-mm-dd hh:mm:ss',
    YY_MM_DD_hh_mm_ss = 'yy-mm-dd hh:mm:ss',
    YYYY_MM_DD_hh_mm = 'yyyy-mm-dd hh:mm',
    YY_MM_DD_hh_mm = 'yy-mm-dd hh:mm',
    DateFull = 'Day Month Date Year hh:mm:ss UTC',
    DateSimple = 'Month Date Year hh:mm',
}