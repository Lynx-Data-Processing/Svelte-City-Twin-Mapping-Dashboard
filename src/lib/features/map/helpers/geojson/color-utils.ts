export const SPEED_COLORS = ['#1800ff', '#0071ff', '#0093ff', '#00a9d1', '#00ba73', '#13c600', '#88ed02', '#fbf01c', '#fa9b45', '#fa6e6e'];
export const RANDOM_COLORS = ["#f44336", "#e91e63", "#8a4af3", "#673ab7", "#3f51b5", "#009688", "#4caf50", "#8bc34a", "#2196f3", "#ffc107", "#ff5722", "#ffeb3b"]


export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * RANDOM_COLORS.length);
  return RANDOM_COLORS[randomIndex];
}


export const getColorGivenIndex = (index: number) => {
  return RANDOM_COLORS[index % RANDOM_COLORS.length];
}
