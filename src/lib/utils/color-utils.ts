import { RANDOM_COLORS } from "$lib/constants";

export const getRandomColorHEX = () => {
  return `#${(Math.floor(Math.random() * 16777215).toString(16)).toString()}`;
};

export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * RANDOM_COLORS.length);
  return RANDOM_COLORS[randomIndex];
}


export const getColorGivenIndex = (index: number) => {
  return RANDOM_COLORS[index % RANDOM_COLORS.length];
}
