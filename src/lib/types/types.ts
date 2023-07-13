
export type IDateTimeDictionaryType = {
    startDateTime: string,
    endDateTime: string,
}

export type ISearchParamType = {
    endpointId: string,
    limit: number,
    offset: number,
    showEvents: boolean,
    useRealData: boolean,
    startDateTime: string,
    endDateTime: string,
}

export type INavbarElement = {
    id: number,
    title: string,
    url?: string,
    icon?: string,
    isExternal?: boolean,
}

export interface Window {
    handleCaptchaCallback: (token: string) => Promise<void>;
}