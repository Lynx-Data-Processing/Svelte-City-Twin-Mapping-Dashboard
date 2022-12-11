
import type { gpsFilterType } from '../../types/types';

export const createFiltersDictionary = (geojsonElement : any) => {
    let gpsFilters: gpsFilterType[] = [];

    if (geojsonElement && geojsonElement.features) {
        const gpsData = geojsonElement.features[0].properties;
        for (const key in gpsData) {
            if (Object.prototype.hasOwnProperty.call(gpsData, key)) {
                const element = gpsData[key];
                if (typeof element === 'number') {
                    gpsFilters.push({
                        id: key,
                        name: key,
                        default: [0, 100],
                        step: 10,
                        suffix: 'AA',
                        selected: [0, 300]
                    });
                }
            }
        }
    }
    return gpsFilters;

}