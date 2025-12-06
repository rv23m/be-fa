export const generateRandomHexColor = () => {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0"); // ensures 6 digits
  return `#${hex}`;
};

export const generateUserColors = [
  "#97EED5",
  "#FFFA9B",
  "#FF946E",
  "#FFAFDF",
  "#B3ACFF",
  "#6FE5FF",
  "#A6FFAC",
  "#FFD76A",
  "#FFDEDE",
  "#F79DFF",
  "#808DFF",
  "#87F9FF",
  "#A2FF88",
  "#FFC79A",
  "#FF8B8B",
  "#B17EFF",
  "#6FADFF",
  "#D6FFA3",
  "#FF5D5D",
  "#FFAFB1",
];
