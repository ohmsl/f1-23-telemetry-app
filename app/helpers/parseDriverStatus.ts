export function parseDriverStatus(status: number) {
  switch (status) {
    case 0:
      return "In Garage";
    case 1:
      return "Flying Lap";
    case 2:
      return "In Lap";
    case 3:
      return "Out Lap";
    case 4:
      return "On Track";
    default:
      return undefined;
  }
}
