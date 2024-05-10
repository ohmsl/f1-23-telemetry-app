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
} from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import parseEventDetails from "../helpers/parseEventDetails";
import parseEventString from "../helpers/parseEventString";
import { useVehicleTelemetry } from "../providers/telemetry/TelemetryProvider";
dayjs.extend(duration);

const EventLog = () => {
  let { participantsData, eventsThisSession: events } = useVehicleTelemetry();

  let participantData = participantsData?.m_participants;

  events = events?.filter((event) => event.m_eventStringCode !== "BUTN");
  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        width: "100%",
        overflowY: "auto",
        flex: 1,
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Event Log
        </Typography>
        <IconButton>
          <Delete />
        </IconButton>
      </Stack>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          overflowX: "auto",
          flex: 1,
        }}
      >
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
                    .format("HH:mm:ss")}
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
        {events?.length === 0 && (
          <Stack
            alignItems="center"
            justifyContent="center"
            flex={1}
            spacing={2}
          >
            <Typography variant="h5" fontFamily="Roboto" color="textSecondary">
              ¯\_(ツ)_/¯
            </Typography>
            <Typography align="center" color="textSecondary">
              No events recorded
            </Typography>
          </Stack>
        )}
      </Paper>
    </Paper>
  );
};

export default EventLog;
