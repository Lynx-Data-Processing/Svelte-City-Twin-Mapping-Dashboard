
const createStyle = (color = 'blue', weight = 4) => ({ strokeColor: color, strokeWeight: weight });
const createIcon = (color: string, scale = 5, path: string | google.maps.SymbolPath | null = google.maps.SymbolPath.CIRCLE, opacity = 1) => ({ path, scale, strokeColor: color, fillColor: color, fillOpacity: opacity });

export const pointStyle = (color: string, size: number = 5) => {
    return { ...createStyle(color), icon: createIcon(color, size) }
};

export const polygonStyle = (color: string) => ({ ...createStyle(color), strokeColor: color, fillColor: color, fillOpacity: 0.5 });

export const lineStyle = (color: string) => createStyle(color, 4);

export const arrowLineStyle = (color: string) => ({
    ...createStyle(color, 4),
    icons: [
        {
            icon: createIcon('white', 2, google.maps.SymbolPath.BACKWARD_CLOSED_ARROW),
            offset: '0',
            repeat: '100px'
        }
    ]
});
