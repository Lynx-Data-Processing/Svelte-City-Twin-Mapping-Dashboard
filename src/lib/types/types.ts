
export type IDateTimeDictionaryType = {
    startDateTime: string,
    endDateTime: string,
}


export interface IFooterElementType {
    id: number,
    name: string,
    url: string,
    icon?: string
}



export interface IMenuComponentsType  {
    id: number,
    title: string,
    component: any,
    props: any,
    icon: string,
    url?: string,
}

export interface Window {
    handleCaptchaCallback: (token: string) => Promise<void>;
}
