import { getRandomColor, getRandomColorHEX } from '$lib/features/map/helpers/geojson/color-utils'; // Replace 'your-file' with the correct path to the file containing the functions.

describe('getRandomColorHEX', () => {
  it('returns a valid HEX color', () => {
    const color = getRandomColorHEX();
    const hexColorRegex = /^#[0-9A-F]{6}$/i; // Regular expression to match a valid HEX color (e.g., #RRGGBB).

    expect(hexColorRegex.test(color)).toBe(true);
  });
});

describe('getRandomColor', () => {
  const SPEED_COLORS = ['#1800ff', '#0071ff', '#0093ff', '#00a9d1', '#00ba73', '#13c600', '#88ed02', '#fbf01c', '#fa9b45', '#fa6e6e'];

  it('returns a color from SPEED_COLORS', () => {
    const color = getRandomColor();
    expect(SPEED_COLORS.includes(color)).toBe(true);
  });
});
