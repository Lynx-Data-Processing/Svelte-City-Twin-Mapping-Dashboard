import { writable } from "svelte/store"
import type { IEventGoogleDataType } from "../types"

interface ISelectedEventStore {
    selectedEvent: IEventGoogleDataType | undefined
}

const selectedEventInitialState: ISelectedEventStore = {
    selectedEvent: undefined
}

const createSelectedEventStore = () => {
    const { subscribe, update } = writable(selectedEventInitialState)

    return {
        subscribe,
        setSelectedEvent: (selectedEvent: IEventGoogleDataType) => update((state) => ({ ...state, selectedEvent })),
        removeSelectedEvent: () => update((state) => ({ ...state, selectedEvent: undefined })),
    }
}

export const selectedEventStore = createSelectedEventStore()