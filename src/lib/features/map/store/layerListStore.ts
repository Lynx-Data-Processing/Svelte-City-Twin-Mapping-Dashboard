import { writable } from 'svelte/store'
import type { ILayerListElement } from '../types'

interface ILayerListStore {
    layerList: ILayerListElement[]
}

const layerListInitialState: ILayerListStore = {
    layerList: []
}

const createLayerListStore = () => {
    const { subscribe, update } = writable(layerListInitialState)

    return {
        subscribe,
        setLayerList: (layerList: ILayerListElement[]) => update((state) => ({ ...state, layerList })),
        removeAllLayerElements: () => update((state) => ({ ...state, layerList: [] })),
    }
}

export const layerListStore = createLayerListStore()