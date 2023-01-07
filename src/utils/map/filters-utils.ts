import type { geojsonType, gpsFilterType } from '../../types/types';

// Used to create the filters for the GPS data
//! Currently not used but will be used in the future
export const createGPSFilters = (geojsonArray: geojsonType[]) => {
    let gpsFilters: gpsFilterType[] = [];


    if (geojsonArray) {
        const gpsKeys = geojsonArray[0].features[0].properties;

        for (const [key, value] of Object.entries(gpsKeys)) {
            console.log(key, value);

            if (typeof value === 'number') {
                gpsFilters.push({
                    id: key,
                    name: key,
                    default: [value / 2, value * 2],
                    step: value / 2,
                    suffix: 'AA',
                    selected: [value / 2, value * 2]
                });
            }
        }
    }
    return gpsFilters;

}