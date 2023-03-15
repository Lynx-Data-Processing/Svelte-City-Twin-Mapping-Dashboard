
import { SPEED_COLORS } from '../lib/constants';

import { getSpeed, getVehicleSpeedColor } from '../utils/vehicle-speed';

describe('getVehicleSpeedColor', () => {
    it('should return the correct color for the given speed', () => {
        expect(getVehicleSpeedColor(5)).toEqual(SPEED_COLORS[0]);
        expect(getVehicleSpeedColor(15)).toEqual(SPEED_COLORS[1]);
        expect(getVehicleSpeedColor(25)).toEqual(SPEED_COLORS[2]);
    });
});

describe('getSpeed', () => {
    test('should return 0 if properties is empty', () => {
        expect(getSpeed({})).toBe(0);
    });

    test('should return the value of the speed property', () => {
        expect(getSpeed({ speed: 10 })).toBe(10);
        expect(getSpeed({ SPEED: 20 })).toBe(20);
        expect(getSpeed({ sPeEd: 30 })).toBe(30);
    });

    test('should return the value of the speed property even if it is mixed with other properties', () => {
        expect(getSpeed({ speed: 10, weight: 20 })).toBe(10);
        expect(getSpeed({ weight: 20, SPEED: 30 })).toBe(30);
    });

    test('should return 0 if no speed property is found', () => {
        expect(getSpeed({ weight: 20 })).toBe(0);
        expect(getSpeed({ meter: 10 })).toBe(0);
    });
});
