const parseSessionType = (
  sessionType: number | undefined,
  longFormat = true
) => {
  switch (sessionType) {
    case 0:
      return "Unavailable";
    case 1:
      return longFormat ? "Practice 1" : "P1";
    case 2:
      return longFormat ? "Practice 2" : "P2";
    case 3:
      return longFormat ? "Practice 3" : "P3";
    case 4:
      return longFormat ? "Practice" : "P";
    case 5:
      return longFormat ? "Qualifying 1" : "Q1";
    case 6:
      return longFormat ? "Qualifying 2" : "Q2";
    case 7:
      return longFormat ? "Qualifying 3" : "Q3";
    case 8:
      return longFormat ? "Qualifying" : "Q";
    case 9:
      return longFormat ? "One Shot Qualifying" : "OSQ";
    case 10:
      return longFormat ? "Race" : "R";
    case 11:
      return longFormat ? "Race 2" : "R2";
    case 12:
      return longFormat ? "Race 3" : "R3";
    case 13:
      return longFormat ? "Time Trial" : "TT";
    default:
      return "Unavailable";
  }
};

export default parseSessionType;
