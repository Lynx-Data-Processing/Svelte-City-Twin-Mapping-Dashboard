export interface Window {
    handleCaptchaCallback: (token: string) => Promise<void>;
}