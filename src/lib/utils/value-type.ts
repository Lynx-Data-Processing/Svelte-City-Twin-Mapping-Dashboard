export function isImage(url: any) {
    return typeof url === 'string' && /\.(jpeg|jpg|gif|png)$/i.test(url);
}
export function isVideo(url: any) {
    return typeof url === 'string' && /\.(mp4|webm|ogg)$/i.test(url);
}
export function isColor(value: any) {
    return typeof value === 'string' && /^#([0-9a-f]{3}){1,2}$/i.test(value);
}
export function isNumber(value: any) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
export function stringifyObject(obj: any): string {
    return typeof obj === 'object' ? JSON.stringify(obj) : obj;
}
