import type { type } from "@testing-library/user-event/dist/types/utility";

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
    icon: string,
    url?: string,
}

export interface Window {
    handleCaptchaCallback: (token: string) => Promise<void>;
}

export interface IDeviceType {
    id: number,
    label: string,
    ipv4Address: string,
    ipv6Address: string,
    type: string,
    ownerUserId: number,
    imageUrl: string,
    createdTime: string,
    tenantId: number,
    tenantID: string,
    country: string,
    city: string,
    platform: string,
    packageVersion: string,
    hostIP: string,
    status: string,
    groupId: number,
    deviceKey: string,
    productId: string,
    systemImage: string,
    oemImage: string,
    vin: string,
    vinUpdatedAt: string,
    canbus: string,
}