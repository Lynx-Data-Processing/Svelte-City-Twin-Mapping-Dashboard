import type {
  videoType
} from '../lib/types/eventTypes';


function separateCaps(str: string) {
  const words = str.split(/(?=[A-Z])/);
  const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  const rest = words.slice(1).join(' ');
  return firstWord + ' ' + rest;
}

function shortenString(str: string) {
  if (str.length > 6) {
    return str.slice(0, 6);
  }
  return str;
}

export const buildPopup = async (features: any, layerName: string, videoLinks: videoType[]) => {
  const container = document.createElement('div');

  // Get the first 8 properties
  const sliced = Object.fromEntries(Object.entries(features.properties).slice(0, 8));
  for (const [key, value] of Object.entries(sliced)) {
    const keyChild = document.createElement('p');
    keyChild.classList.add('block', 'font-bold');
    keyChild.append(separateCaps(key.toString()));

    const valueChild = document.createElement('p');
    valueChild.classList.add('block');
    valueChild.append(shortenString((value as any).toString()));

    container.append(keyChild, valueChild);
  }

  // If the layer is GPS, add the video
  if (layerName.includes('GPS')) {

    const videos = videoLinks.filter(o => o.eventId === features.properties.EventId);
    let src = videos.length ? videos[0].videoUrl! : '';

    if (!src) {
      const pictureChild = document.createElement('div');
      const defaultImg = document.createElement('img');
      defaultImg.src = 'https://www.thejungleadventure.com/assets/images/logo/novideo.png';
      pictureChild.appendChild(defaultImg);
      container.append(pictureChild);
    } else {
      const videoChild = document.createElement('video');
      videoChild.classList.add('object-cover', 'rounded-lg');
      videoChild.width = 320;
      videoChild.height = 240;
      videoChild.controls = true;

      const videoChildSource = document.createElement('source');
      videoChildSource.src = src;
      videoChildSource.type = 'video/mp4';
      videoChild.append(videoChildSource, 'Your browser does not support the video tag.');

      container.append(videoChild);
    }
  }
  return container.innerHTML;
};

export default buildPopup;
