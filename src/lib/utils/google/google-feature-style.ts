

import { EMERGENCY_RECORD, TAILGATING_GPS } from "$lib/constants/strings";
import type { IEventGoogleDataType } from "$lib/types/googleTypes";
import type { IIconType } from "$lib/types/mapTypes";

export const pointStyle = (style: google.maps.Data.StyleOptions, color: string, size: number = 5) => {
    return {
        ...style,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: size,
            strokeColor: color,
            fillColor: color,
            fillOpacity: 1
        }
    };
}

export const eventPointStyle = (feature: IEventGoogleDataType, style: google.maps.Data.StyleOptions, color: string, size: number = 7) => {


    let icon: IIconType = {
        path: '',
        scale: size,
        strokeColor: color,
        fillColor: color,
        fillOpacity: 0.8
    }

    let triggerName = feature.triggerName.toLowerCase();
    if (triggerName.includes(TAILGATING_GPS.toLowerCase())) {
        icon = {
            path: 'M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32H346.6c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2V400v48c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V400H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V400 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z',
            scale: 0.03,
            strokeColor: "#f5554a",
            fillColor: "#f5554a",
            fillOpacity: 1
        }
    }
    else if (triggerName.includes(EMERGENCY_RECORD.toLowerCase())) {
        icon = {
            path: "M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z",
            scale: 0.03,
            strokeColor: "#f5554a",
            fillColor: "#f5554a",
            fillOpacity: 1
        }
    }

    return {
        ...style,
        icon: icon
    };
}

export const polygonStyle = (style: google.maps.Data.StyleOptions, color: string) => {
    return {
        ...style,
        strokeColor: color,
        fillColor: color,
        fillOpacity: 0.5
    };
}

export const lineStyle = (style: google.maps.Data.StyleOptions, color: string) => {
    style = {
        ...style,
        strokeWeight: 6,
    };
    return style;
}

export const tripLineStyle = (style: google.maps.Data.StyleOptions, color: string) => {
    return {
        ...style,
        icons: [
            {
                icon: {
                    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    scale: 2,
                    strokeColor: 'white',
                    fillColor: 'white',
                    fillOpacity: 1
                },
                offset: '0',
                repeat: '100px'
            }
        ]
    }
}