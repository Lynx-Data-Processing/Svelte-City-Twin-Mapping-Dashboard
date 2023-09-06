

export type ISearchParamType = {
    endpointId: string,
    limit: number,
    offset: number,
    showEvents: boolean,
    useRealData: boolean,
    startDateTime: string,
    endDateTime: string,
}


export interface INavbarElement {
    id: number;
    name: string;
    href: string;
    icon: string;
    isExternal: boolean;
}


export interface Window {
    handleCaptchaCallback: (token: string) => Promise<void>;
}