export function isImage(url: any) {
    try {
        return typeof url === 'string' && /\.(jpeg|jpg|gif|png)$/i.test(url);
    } catch (e) {
        return false;
    }
}

export function isVideo(url: any) {
    try {
        return typeof url === 'string' && /\.(mp4|webm|ogg)$/i.test(url);
    } catch (e) {
        return false;
    }
}


export function isColor(value: any) {
    try {
        return typeof value === 'string' && /^#([0-9a-f]{3}){1,2}$/i.test(value);
    } catch (e) {
        return false;
    }
}

export function isNumber(value: any) {
    try {
        return !isNaN(parseFloat(value)) && isFinite(value);
    } catch (e) {
        return false;
    }
}


export function stringifyObject(obj: any): string {
    try {
        return typeof obj === 'object' ? JSON.stringify(obj) : obj;
    } catch (e) {
        return 'Invalid Object';
    }
}
