
export function exportJSONToFile(jsonData: object, filename: string) {
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Remove the link and revoke the object URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}