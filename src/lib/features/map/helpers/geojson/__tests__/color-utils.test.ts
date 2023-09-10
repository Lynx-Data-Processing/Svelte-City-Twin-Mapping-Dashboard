// tests/colorUtilities.spec.ts
import { test, expect } from 'vitest'
import { getRandomColor, getColorGivenIndex, RANDOM_COLORS, SPEED_COLORS } from '../color-utils' // Update the import based on your actual file path

test('getRandomColor should return a color from RANDOM_COLORS', () => {
  const color = getRandomColor();
  expect(RANDOM_COLORS).toContain(color);
})

test('getRandomColor should return a valid color string', () => {
  const color = getRandomColor();
  expect(/^#([0-9a-f]{6})$/i.test(color)).toBe(true);
})

test('getColorGivenIndex should return the color at the given index in RANDOM_COLORS', () => {
  const index = 3;
  const color = getColorGivenIndex(index);
  expect(color).toBe(RANDOM_COLORS[index]);
})

test('getColorGivenIndex should return the first color for index equal to length of RANDOM_COLORS', () => {
  const index = RANDOM_COLORS.length;
  const color = getColorGivenIndex(index);
  expect(color).toBe(RANDOM_COLORS[0]);
})

test('getColorGivenIndex should return the color based on modulo operation for index greater than length of RANDOM_COLORS', () => {
  const index = RANDOM_COLORS.length + 3;
  const color = getColorGivenIndex(index);
  expect(color).toBe(RANDOM_COLORS[index % RANDOM_COLORS.length]);
})
