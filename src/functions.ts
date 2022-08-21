export const generateGrid = (rows: number, cols: number, random?: boolean) => {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    random
      ? grid.push(Array.from(Array(cols), () => (Math.random() > 0.65 ? 1 : 0)))
      : grid.push(Array.from(Array(cols)).fill(0));
  }
  return grid;
};
