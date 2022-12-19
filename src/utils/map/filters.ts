import type { gpsFilterType } from '../../types/types';

export const createFilterArray = (gpsFilters : gpsFilterType[]) => {
   
    let filterArray = ['all'];
    for (let i = 0; i < gpsFilters.length; i++) {
        let id = gpsFilters[i].id;
        let min = gpsFilters[i].selected[0];
        let max = gpsFilters[i].selected[1];
        let minArray : any = ['>=', ['get', id], min];
        let maxArray : any = ['<=', ['get', id], max];
        filterArray.push(minArray);
        filterArray.push(maxArray);
    }
    return filterArray;
};