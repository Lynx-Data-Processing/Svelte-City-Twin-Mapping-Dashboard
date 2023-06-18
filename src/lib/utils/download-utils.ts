



export const javascriptObjectToJSONFile = (data: object, filename: string) => {
    try {

        let seen: any[] = [];

        const dataOBJ: any = JSON.stringify(data, function (key, val) {
            if (val != null && typeof val == "object") {
                if (seen.indexOf(val) >= 0) {
                    return;
                }
                seen.push(val);
            }
            return val;
        });

        const blob = new Blob([dataOBJ], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error(err)
    }

}