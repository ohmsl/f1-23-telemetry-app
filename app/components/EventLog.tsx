import { PacketEventData } from "@/types/PacketEventData";
import { ParticipantData } from "@/types/ParticipantData";
import Delete from "@mui/icons-material/Delete";
import {
  IconButton,
  Paper,
  Stack,
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
  events: Array<PacketEventData> | undefined;
  participantData: Array<ParticipantData> | undefined;
};

const EventLog = ({ events, participantData }: EventLogProps) => {
  events = events?.filter((event) => event.m_eventStringCode !== "BUTN");
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
        flex: 1,
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Event Log
        </Typography>
        <IconButton>
          <Delete />
        </IconButton>
      </Stack>
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
            {events?.map((event, index) => (
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
                  {event &&
                    participantData &&
                    parseEventDetails(event, participantData)}
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
