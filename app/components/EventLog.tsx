import { PacketEventData } from "@/types/PacketEventData";
import { ParticipantData } from "@/types/ParticipantData";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  darkScrollbar,
} from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import parseEventDetails from "../helpers/parseEventDetails";
import parseEventString from "../helpers/parseEventString";
dayjs.extend(duration);

type EventLogProps = {
  events: Array<PacketEventData>;
  participantData: Array<ParticipantData>;
};

const EventLog = ({ events, participantData }: EventLogProps) => {
  events = events.filter((event) => event.m_eventStringCode !== "BUTN");
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        width: "100%",
        maxHeight: "100%",
        overflowY: "auto",
        ...darkScrollbar(),
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Event Log
      </Typography>
      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Event</TableCell>
              <TableCell align="right">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  {dayjs
                    .duration(event.m_header.session_time, "seconds")
                    .format("mm:ss")}
                </TableCell>
                <TableCell>
                  {parseEventString(event.m_eventStringCode)}
                </TableCell>
                <TableCell align="right">
                  {parseEventDetails(event, participantData)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Paper>
  );
};

export default EventLog;
