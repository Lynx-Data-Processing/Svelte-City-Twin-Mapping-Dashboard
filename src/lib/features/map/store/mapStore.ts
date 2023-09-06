import { writable } from "svelte/store";
// @ts-ignore
import type { Map } from 'google.maps';

interface IMapStore {
    map: Map | undefined,
    selectedMapElement: google.maps.Data.Feature | undefined
}

const mapInitialState: IMapStore = {
    map: undefined,
    selectedMapElement: undefined
}

const createMapStore = () => {
    const { subscribe, update } = writable(mapInitialState)

    return {
        subscribe,
        setMap: (map: Map) => update((state) => ({ ...state, map })),
        removeMap: () => update((state) => ({ ...state, map: undefined })),
        setSelectedMapElement: (selectedMapElement: google.maps.Data.Feature) => update((state) => ({ ...state, selectedMapElement })),
        removeSelectedMapElement: () => update((state) => ({ ...state, selectedMapElement: undefined })),
    }
}

export const mapStore = createMapStore()