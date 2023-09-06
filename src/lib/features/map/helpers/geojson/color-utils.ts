import { RANDOM_COLORS } from "$lib/constants";

export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * RANDOM_COLORS.length);
  return RANDOM_COLORS[randomIndex];
}


export const getColorGivenIndex = (index: number) => {
  return RANDOM_COLORS[index % RANDOM_COLORS.length];
}
