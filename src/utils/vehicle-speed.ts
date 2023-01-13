import { SPEED_COLORS } from '../constants';


//* Get a color for every 10km/h
//* Example: 0-9Km/h, 10-19km/h
export const getVehicleSpeedColor = (speed: number) => {

    const rangeSize = 10;
    let speedIndex = Math.floor(speed / rangeSize);
    speedIndex = speedIndex >= SPEED_COLORS.length ? SPEED_COLORS.length - 1 : speedIndex;
    return SPEED_COLORS[speedIndex];
};

//* Get the speed from the properties object
//* Speed is sometimes not found in the object, in that case, return 0
export const getSpeed = (properties: object) => {
    let speed = 0;
    for (const [key, value] of Object.entries(properties)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('speed')) {
            speed = parseInt(value, 10);;
        }
    }
    return speed;
};