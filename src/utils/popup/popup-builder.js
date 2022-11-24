import { findVideo } from './video-finder';

export const buildPopup = async (features, layerName, videoLinks) => {
  const container = document.createElement('div');

  const sliced = Object.fromEntries(Object.entries(features.properties).slice(0, 8));
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(sliced)) {
    const keyChild = document.createElement('p');
    keyChild.classList.add('block', 'font-bold');
    keyChild.append(key.toString());

    const valueChild = document.createElement('p');
    valueChild.classList.add('block');
    valueChild.append(value.toString());

    container.append(keyChild, valueChild);
  }

  if (layerName.includes('GPS')) {
  
    let src = '';
    if(features.properties.DeviceId === 'CK20520033'){
      src = `/USARS_Machine_Learning/${features.properties.EventId}-converted.mp4`;
    }
    else{
      src = videoLinks.find(o=>  o.eventId === features.properties.EventId).videoUrl;
    }

    if (!src) {
      // create div to store the image in
      const pictureChild = document.createElement('div');
      pictureChild.width = 320;
      pictureChild.height = 240;

      // create the image
      const defaultImg = document.createElement('img');
      defaultImg.src = 'https://www.thejungleadventure.com/assets/images/logo/novideo.png';

      // append the image to the fiv
      pictureChild.appendChild(defaultImg);

      // append the div to the container
      container.append(pictureChild);
    } else {
      const videoChild = document.createElement('video');
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
