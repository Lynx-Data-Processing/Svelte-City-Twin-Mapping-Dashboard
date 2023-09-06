
import { writable } from "svelte/store";
import type { ISeachParameters } from "../types";

interface ISearchParamStore {
    searchParameters: ISeachParameters
}

const searchParamInitialState: ISearchParamStore = {
    searchParameters: {
        dateStart: "2023-07-01T09:47",
        dateEnd: "2023-07-18T09:47",
        location: undefined,
        model: "model1",
        returnVideo: false
    }
}

const createSearchParamStore = () => {
    const { subscribe, update } = writable(searchParamInitialState)

    return {
        subscribe,
        setSearchParameters: (searchParameters: ISeachParameters) => update((state) => ({ ...state, searchParameters })),
        removeSearchParameters: () => update((state) => ({ ...state, searchParameters: searchParamInitialState.searchParameters })),
    }
}

export const searchParamStore = createSearchParamStore()