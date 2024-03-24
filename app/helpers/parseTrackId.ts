const parseTrackId = (trackId: number) => {
  switch (trackId) {
    case 0:
      return "Melbourne";
    case 1:
      return "Paul Ricard";
    case 2:
      return "Shanghai";
    case 3:
      return "Sakhir (Bahrain)";
    case 4:
      return "Catalunya";
    case 5:
      return "Monaco";
    case 6:
      return "Montreal";
    case 7:
      return "Silverstone";
    case 8:
      return "Hockenheim";
    case 9:
      return "Hungaroring";
    case 10:
      return "Spa";
    case 11:
      return "Monza";
    case 12:
      return "Singapore";
    case 13:
      return "Suzuka";
    case 14:
      return "Abu Dhabi";
    case 15:
      return "Texas";
    case 16:
      return "Brazil";
    case 17:
      return "Austria";
    case 18:
      return "Sochi";
    case 19:
      return "Mexico";
    case 20:
      return "Baku (Azerbaijan)";
    case 21:
      return "Sakhir Short";
    case 22:
      return "Silverstone Short";
    case 23:
      return "Texas Short";
    case 24:
      return "Suzuka Short";
    case 25:
      return "Hanoi";
    case 26:
      return "Zandvoort";
    case 27:
      return "Imola";
    case 28:
      return "Portimão";
    case 29:
      return "Jeddah";
    case 30:
      return "Miami";
    case 31:
      return "Las Vegas";
    case 32:
      return "Losail";
    default:
      return "Unavailable";
  }
};

export default parseTrackId;
