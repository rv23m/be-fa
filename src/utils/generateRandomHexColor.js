export const generateRandomHexColor = () => {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0"); // ensures 6 digits
  return `#${hex}`;
};
