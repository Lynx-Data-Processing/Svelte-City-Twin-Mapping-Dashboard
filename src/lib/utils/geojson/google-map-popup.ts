import type { ITripEventWithSensorDataType } from "$lib/types/eventTypes";
import type { ILayerListElementType } from "$lib/types/mapTypes";
import { millisecondUnixToDateTime } from "../date-format";
import { formatText } from "../text-format";


export const createImageDiv = (image1: string, image2: string): string => {
    return `
      <div class="flex flex-row mt-4">
        <img class="w-64 h-auto object-cover" src="${image1}" />
        <img class="w-64 h-auto object-cover" src="${image2}" />
      </div>
    `;
};

export const createContentString = (feature: any, maxCount: number): string => {
    let contentString = '';
    let count = 0;
    feature.forEachProperty((value: any, name: any) => {
        if (count > maxCount) return;
        contentString += `<p> <span class="font-bold">${formatText(name)}</span>: ${value}</p>`;
        count++;
    });

    return contentString;
};

export const createEventGoogleMapsPopup = (feature: ITripEventWithSensorDataType): string => {
    let contentString = `
      <p class="text-subtitle font-bold">${formatText(feature.triggerName)}</p>
      <hr class="bg-primary w-12 h-1 my-2" /> 
    `;
    
    contentString += `
        <p> <span class="font-bold">Event ID</span>: ${formatText(feature.id)}</p>
        <p> <span class="font-bold">Recording Start</span>: ${feature.recordingStartTimestamp ? millisecondUnixToDateTime(feature.recordingStartTimestamp) : "N/A"}</p>
        <p> <span class="font-bold">Recording End</span>: ${feature.recordingEndTimestamp ? millisecondUnixToDateTime(feature.recordingEndTimestamp) : "N/A"}</p>
        <p> <span class="font-bold">Trigger Name</span>: ${formatText(feature.triggerName)}</p>

    `

    const image1 = feature.snapshots[0]?.downloadUrl;
    const image2 = feature.snapshots[2]?.downloadUrl;
    if (image1 && image2) {
        contentString += createImageDiv(image1, image2);
    }

    return contentString;
};

export const createGooglePopup = (feature: any, layerListElement: ILayerListElementType): string => {
    let contentString = `
      <p class="text-subtitle font-bold">${layerListElement.layerName}</p>
      <hr class="bg-primary w-12 h-1 my-2" /> 
    `;

    const maxCount = 10;
    contentString += createContentString(feature, maxCount);

    return contentString;
};
