
import type { IEventGoogleDataType, ITripGoogleDataType } from "$lib/types/googleTypes";
import type { ILayerListElementType } from "$lib/types/mapTypes";

import { millisecondUnixToDateTime } from "../date-format";
import { formatText } from "../text-format";


export const createImageDiv = (image: string): string => {
  return `
      <div class="flex flex-row mt-4">
        <img class="w-96 h-auto object-cover" src="${image}" />
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

export const createTripGoogleMapsPopup = (feature: ITripGoogleDataType): string => {

  let contentString = `
  <p class="text-subtitle ">${formatText(feature.endpointName)}</p>
  <hr class="bg-primary w-12 h-0.5 my-1" />
  `;

  contentString += `
    <p> <span class="font-bold">Trip ID</span>: ${formatText(feature.id)}</p>
    <p> <span class="font-bold">Start Time</span>: ${feature.startTimestamp ? millisecondUnixToDateTime(feature.startTimestamp) : "N/A"}</p>
    <p> <span class="font-bold">End Time</span>: ${feature.endTimestamp ? millisecondUnixToDateTime(feature.endTimestamp) : "N/A"}</p>
    <p> <span class="font-bold">Status</span>: ${feature.tripStatus ? feature.tripStatus : "N/A"}</p>
    <p> <span class="font-bold">Distance</span>: ${feature.distance ? `${(feature.distance / 1000).toFixed(2)} km` : 'N/A'}</p>
    `

  return contentString;

}

export const createEventGoogleMapsPopup = (feature: IEventGoogleDataType): string => {

  let contentString = `
      <p class="text-subtitle ">${formatText(feature.triggerName)}</p>
      <hr class="bg-primary w-12 h-0.5 my-1" /> 
    `;

  contentString += `
        <p> <span class="font-bold">Event ID</span>: ${formatText(feature.id)}</p>
        <p> <span class="font-bold">Recording Start</span>: ${feature.recordingStartTimestamp ? millisecondUnixToDateTime(feature.recordingStartTimestamp) : "N/A"}</p>
        <p> <span class="font-bold">Recording End</span>: ${feature.recordingEndTimestamp ? millisecondUnixToDateTime(feature.recordingEndTimestamp) : "N/A"}</p>
        <p> <span class="font-bold">Trigger Name</span>: ${formatText(feature.triggerName)}</p>

    `

  // if (feature.snapshots) {

  //   let videoObjects = feature.snapshots.find((o) => o.source.includes("vid"));
  //   const image = videoObjects?.downloadUrl;
  //   if (image) {
  //     contentString += createImageDiv(image);
  //   }
  // }
  return contentString;
};

export const createGooglePopup = (feature: any, layerListElement: ILayerListElementType): string => {
  let contentString = `
      <p class="text-subtitle ">${layerListElement.layerName}</p>
      <hr class="bg-primary w-12 h-0.5 my-1" /> 
    `;

  const maxCount = 10;
  contentString += createContentString(feature, maxCount);

  return contentString;
};
