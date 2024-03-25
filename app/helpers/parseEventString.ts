import { PacketEventData } from "@/types/PacketEventData";

// Event String Codes
// Event Code Description
// Session Started “SSTA” Sent when the session starts
// Session Ended “SEND” Sent when the session ends
// Fastest Lap “FTLP” When a driver achieves the fastest lap
// Retirement “RTMT” When a driver retires
// DRS enabled “DRSE” Race control have enabled DRS
// DRS disabled “DRSD” Race control have disabled DRS
// Team mate in pits “TMPT” Your team mate has entered the pits
// Chequered flag “CHQF” The chequered flag has been waved
// Race Winner “RCWN” The race winner is announced
// Penalty Issued “PENA” A penalty has been issued – details in event
// Speed Trap Triggered “SPTP” Speed trap has been triggered by fastest speed
// Start lights “STLG” Start lights – number shown
// Lights out “LGOT” Lights out
// Drive through served “DTSV” Drive through penalty served
// Stop go served “SGSV” Stop go penalty served
// Flashback “FLBK” Flashback activated
// Button status “BUTN” Button status changed
// Red Flag “RDFL” Red flag shown
// Overtake “OVTK” Overtake occurred

const parseEventString = (
  eventString: PacketEventData["m_eventStringCode"]
) => {
  switch (eventString) {
    case "SSTA":
      return "Session Started";
    case "SEND":
      return "Session Ended";
    case "FTLP":
      return "Fastest Lap";
    case "RTMT":
      return "Retirement";
    case "DRSE":
      return "DRS enabled";
    case "DRSD":
      return "DRS disabled";
    case "TMPT":
      return "Team mate in pits";
    case "CHQF":
      return "Chequered flag";
    case "RCWN":
      return "Race Winner";
    case "PENA":
      return "Penalty Issued";
    case "SPTP":
      return "Speed Trap Triggered";
    case "STLG":
      return "Start lights";
    case "LGOT":
      return "Lights out";
    case "DTSV":
      return "Drive through served";
    case "SGSV":
      return "Stop go served";
    case "FLBK":
      return "Flashback";
    case "BUTN":
      return "Button status";
    case "RDFL":
      return "Red Flag";
    case "OVTK":
      return "Overtake";
    default:
      return eventString;
  }
};

export default parseEventString;
