import { writable } from 'svelte/store'
import type { IMapLayer } from '../types'

interface IMapLayerStore {
    mapLayers: IMapLayer[]
}

const layerListInitialState: IMapLayerStore = {
    mapLayers: []
}

const createMapLayerStore = () => {
    const { subscribe, update } = writable(layerListInitialState)

    return {
        subscribe,
        setMapLayers: (layerList: IMapLayer[]) => update((state) => ({ ...state, mapLayers: layerList })),
        removeAllMapLayers: () => update((state) => ({ ...state, mapLayers: [] })),
    }
}

export const mapLayerStore = createMapLayerStore()