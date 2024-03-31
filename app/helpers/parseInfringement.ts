export const parseInfringement = (infringementId: number): string => {
  switch (infringementId) {
    case 0:
      return "Blocking by slow driving";
    case 1:
      return "Blocking by wrong way driving";
    case 2:
      return "Reversing off the start line";
    case 3:
      return "Big Collision";
    case 4:
      return "Small Collision";
    case 5:
      return "Collision failed to hand back position single";
    case 6:
      return "Collision failed to hand back position multiple";
    case 7:
      return "Corner cutting gained time";
    case 8:
      return "Corner cutting overtake single";
    case 9:
      return "Corner cutting overtake multiple";
    case 10:
      return "Crossed pit exit lane";
    case 11:
      return "Ignoring blue flags";
    case 12:
      return "Ignoring yellow flags";
    case 13:
      return "Ignoring drive through";
    case 14:
      return "Too many drive throughs";
    case 15:
      return "Drive through reminder serve within n laps";
    case 16:
      return "Drive through reminder serve this lap";
    case 17:
      return "Pit lane speeding";
    case 18:
      return "Parked for too long";
    case 19:
      return "Ignoring tyre regulations";
    case 20:
      return "Too many penalties";
    case 21:
      return "Multiple warnings";
    case 22:
      return "Approaching disqualification";
    case 23:
      return "Tyre regulations select single";
    case 24:
      return "Tyre regulations select multiple";
    case 25:
      return "Lap invalidated corner cutting";
    case 26:
      return "Lap invalidated running wide";
    case 27:
      return "Corner cutting ran wide gained time minor";
    case 28:
      return "Corner cutting ran wide gained time significant";
    case 29:
      return "Corner cutting ran wide gained time extreme";
    case 30:
      return "Lap invalidated wall riding";
    case 31:
      return "Lap invalidated flashback used";
    case 32:
      return "Lap invalidated reset to track";
    case 33:
      return "Blocking the pitlane";
    case 34:
      return "Jump start";
    case 35:
      return "Safety car to car collision";
    case 36:
      return "Safety car illegal overtake";
    case 37:
      return "Safety car exceeding allowed pace";
    case 38:
      return "Virtual safety car exceeding allowed pace";
    case 39:
      return "Formation lap below allowed speed";
    case 40:
      return "Formation lap parking";
    case 41:
      return "Retired mechanical failure";
    case 42:
      return "Retired terminally damaged";
    case 43:
      return "Safety car falling too far back";
    case 44:
      return "Black flag timer";
    case 45:
      return "Unserved stop go penalty";
    case 46:
      return "Unserved drive through penalty";
    case 47:
      return "Engine component change";
    case 48:
      return "Gearbox change";
    case 49:
      return "Parc Fermé change";
    case 50:
      return "League grid penalty";
    case 51:
      return "Retry penalty";
    case 52:
      return "Illegal time gain";
    case 53:
      return "Mandatory pitstop";
    case 54:
      return "Attribute assigned";
    default:
      return "Unknown";
  }
};
