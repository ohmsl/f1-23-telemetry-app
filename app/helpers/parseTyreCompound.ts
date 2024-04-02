export const parseVisualTyreCompound = (compound: number): string => {
  switch (compound) {
    case 16:
      return "Soft";
    case 17:
      return "Medium";
    case 18:
      return "Hard";
    case 7:
      return "Intermediate";
    case 8:
      return "Wet";
    case 15:
      return "Wet";
    case 19:
      return "Super Soft";
    case 20:
      return "Soft";
    case 21:
      return "Medium";
    case 22:
      return "Hard";
    default:
      return "Unknown";
  }
};
