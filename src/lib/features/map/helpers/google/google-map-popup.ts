import type { IMapLayer } from "$lib/features/map/types";
import { formatText } from "./text-format";

//* Lets create a popup for the google map but only show the first 10 properties as a preview
export const createMapPopup = (feature: google.maps.Data.Feature , layerListElement: IMapLayer): string => {
  let content = `<p class="text-subtitle mb-2">${layerListElement.layerName}</p>`;

  let count = 0;
  const maxCount = 10;

  feature.forEachProperty((value: any, name: any) => {
    if (count > maxCount) return;
    content += `<p><span class="font-bold">${formatText(name)}</span>: ${value}</p>`;
    count++;
  });

  return content;
};
