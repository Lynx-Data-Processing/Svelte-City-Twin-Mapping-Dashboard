

import { writable } from "svelte/store";
// @ts-ignore
import type { Map } from 'google.maps';

interface IMapStore {
    map: Map | undefined
}

const mapInitialState: IMapStore = {
    map: undefined
}

const createMapStore = () => {
    const { subscribe, update } = writable(mapInitialState)

    return {
        subscribe,
        setMap: (map: Map) => update((state) => ({ ...state, map })),
    }
}

export const mapStore = createMapStore()