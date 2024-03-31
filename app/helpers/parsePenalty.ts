export const parsePenalty = (penaltyId: number): string => {
  switch (penaltyId) {
    case 0:
      return "Drive through";
    case 1:
      return "Stop Go";
    case 2:
      return "Grid penalty";
    case 3:
      return "Penalty reminder";
    case 4:
      return "Time penalty";
    case 5:
      return "Warning";
    case 6:
      return "Disqualified";
    case 7:
      return "Removed from formation lap";
    case 8:
      return "Parked too long timer";
    case 9:
      return "Tyre regulations";
    case 10:
      return "This lap invalidated";
    case 11:
      return "This and next lap invalidated";
    case 12:
      return "This lap invalidated without reason";
    case 13:
      return "This and next lap invalidated without reason";
    case 14:
      return "This and previous lap invalidated";
    case 15:
      return "This and previous lap invalidated without reason";
    case 16:
      return "Retired";
    case 17:
      return "Black flag timer";
    default:
      return "Unknown";
  }
};
