import { EMERGENCY_RECORD, TAILGATING_GPS, TRAFFIC_LIGHT } from "$lib/features/map/constants/geojson";
import { EMERGENCY_ICON_PATH, TAILGATING_ICON_PATH, TRAFFIC_LIGHT_ICON_PATH } from "$lib/features/map/constants/icons";
import type { IEventGoogleDataType } from "$lib/features/map/types";

const createStyle = (color = 'blue', weight = 4) => ({ strokeColor: color, strokeWeight: weight });
const createIcon = (color: string, scale = 5, path: string | google.maps.SymbolPath | null = google.maps.SymbolPath.CIRCLE, opacity = 1) => ({ path, scale, strokeColor: color, fillColor: color, fillOpacity: opacity });

export const pointStyle = (color: string, size: number = 5) => {
    return { ...createStyle(color), icon: createIcon(color, size) }
};

export const eventPointStyle = (feature: IEventGoogleDataType, color: string, size: number = 7) => {
    let style = createStyle(color);
    let icon = createIcon(color, size, '', 0.8);
    let triggerName = feature.triggerName.toLowerCase();
    console.log(triggerName)
    if (triggerName.includes(TAILGATING_GPS.toLowerCase())) {
        icon = createIcon("#f5554a", 0.03, TAILGATING_ICON_PATH);
    }
    else if (triggerName.includes(EMERGENCY_RECORD.toLowerCase())) {
        icon = createIcon("#f5554a", 0.03, EMERGENCY_ICON_PATH);
    }
    else if (triggerName.includes(TRAFFIC_LIGHT.toLowerCase())) {
        icon = createIcon("#f554a", 0.3, TRAFFIC_LIGHT_ICON_PATH)
    }

    console.log(icon)
    return { ...style, icon: icon };
}

export const polygonStyle = (color: string) => ({ ...createStyle(color), strokeColor: color, fillColor: color, fillOpacity: 0.5 });

export const lineStyle = (color: string) => createStyle(color, 6);

export const tripLineStyle = (color: string) => ({
    ...createStyle(color, 6),
    icons: [
        {
            icon: createIcon('white', 2, google.maps.SymbolPath.BACKWARD_CLOSED_ARROW),
            offset: '0',
            repeat: '100px'
        }
    ]
});
