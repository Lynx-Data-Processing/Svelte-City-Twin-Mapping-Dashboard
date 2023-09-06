

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