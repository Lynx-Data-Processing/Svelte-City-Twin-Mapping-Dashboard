import { SPEED_COLORS } from '../constants';


//* Get a color for every 10km/h
//* Example: 0-9Km/h, 10-19km/h
export const getVehicleSpeedColor = (speed: number) => {
    const speedIndex = Math.min(Math.floor(speed / 10), SPEED_COLORS.length - 1);
    return SPEED_COLORS[speedIndex];
};

//* Get the speed from the properties object
//* Speed is sometimes not found in the object, in that case, return 0
export const getSpeed = (properties: object) => {
    for (const [key, value] of Object.entries(properties)) {
        if (key.toLowerCase().includes('speed')) {
            return parseInt(value, 10);
        }
    }
    return 0;
};