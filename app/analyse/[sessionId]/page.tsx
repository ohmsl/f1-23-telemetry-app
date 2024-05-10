"use client";
import CarSetupDialog from "@/app/components/Dialogs/CarSetupDialog";
import { computeDelta } from "@/app/helpers/computeDelta";
import parseSessionType from "@/app/helpers/parseSessionType";
import parseTrackId from "@/app/helpers/parseTrackId";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useEffect, useState } from "react";
dayjs.extend(duration);

type Session = Prisma.SessionGetPayload<{
  include: { lapHistory: true };
}>;

type Lap = Prisma.LapGetPayload<{
  include: { carSetup: true; tyres: true };
}>;

const AnalyseSessionPage = ({ params }: { params: { sessionId: string } }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [setupDialogOpen, setSetupDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch(
        `http://localhost:9000/sessions/${params.sessionId}`
      );
      const data = JSON.parse(await response.json());
      setSession(data);
      console.log(data);
    };
    fetchSession();
  }, [params.sessionId]);

  const theme = useTheme();
  return (
    <Container
      maxWidth="xl"
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {session && (
        <Stack spacing={2} width="100%" px={2} flex={1}>
          <Paper sx={{ p: 2 }} variant="outlined">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              px={1}
            >
              <Typography variant="h4">Session Analysis</Typography>
              <ListItemText
                primary={dayjs(session.createdAt).format(
                  "DD/MM/YYYY - HH:mm:ss"
                )}
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {"ID: " + session.id}
                  </Typography>
                }
                sx={{ textAlign: "right" }}
              />
            </Stack>
          </Paper>
          <Card
            sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
            variant="outlined"
          >
            <Stack spacing={3} direction="row">
              <Box>
                <Typography color="text.secondary">Session Type</Typography>
                <Typography variant="h6">
                  {parseSessionType(session.sessionType)}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography color="text.secondary">Track</Typography>
                <Typography variant="h6">
                  {parseTrackId(session.trackId)}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography color="text.secondary">Online</Typography>
                <Typography variant="h6">
                  {session.networkGame ? "Yes" : "No"}
                </Typography>
              </Box>
            </Stack>
            <Stack spacing={3} direction="row">
              <Box>
                <Typography color="text.secondary">Best Lap</Typography>
                <Typography variant="h6">
                  Lap {session.bestLapNum} /{" "}
                  {dayjs
                    .duration(
                      Number(
                        session.lapHistory[session.bestLapNum - 1]?.lapTimeInMS
                      )
                    )
                    .format("mm:ss.SSS")}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box>
                <Typography color="text.secondary">Total Laps</Typography>
                <Typography variant="h6">{session.totalLaps}</Typography>
              </Box>
            </Stack>
          </Card>
          <Paper sx={{ display: "flex", p: 2, flex: 1 }} variant="outlined">
            <Stack spacing={2} flex={1} direction="column">
              <Paper
                sx={{
                  height: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {session.lapHistory ? (
                  <LineChart
                    series={[
                      {
                        data: session.lapHistory.map((lap) => lap.lapTimeInMS),
                        label: "Lap Time",
                        valueFormatter: (value) =>
                          dayjs.duration(Number(value)).format("mm:ss.SSS"),
                      },
                      {
                        data: (session.lapHistory as Array<Lap>).map(
                          (lap) => lap.tyres?.[0]?.tyreWear
                        ),
                        label: "Tyre Wear",
                      },
                    ]}
                    height={400}
                    grid={{ vertical: true, horizontal: true }}
                    yAxis={[
                      {
                        valueFormatter: (value) =>
                          dayjs.duration(Number(value)).format("mm:ss.SSS"),
                      },
                    ]}
                    margin={{ left: 80, right: 20 }}
                    colors={[
                      theme.palette.warning.main,
                      theme.palette.error.main,
                    ]}
                  />
                ) : (
                  <Typography variant="body1">No lap data available</Typography>
                )}
              </Paper>
              <Paper
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  overflowX: "auto",
                  flex: 1,
                }}
              >
                <Table
                  sx={{
                    "& tr:last-child td": {
                      border: 0,
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Lap</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell align="right">S1</TableCell>
                      <TableCell align="right">S2</TableCell>
                      <TableCell align="right">S3</TableCell>
                      <TableCell align="right">Setup</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(session.lapHistory as Array<Lap>)?.map((lap, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            {dayjs
                              .duration(Number(lap.lapTimeInMS))
                              .format("mm:ss.SSS")}
                            {index !== 0 && (
                              <Chip
                                label={
                                  computeDelta(
                                    lap.lapTimeInMS,
                                    session.lapHistory[index - 1]?.lapTimeInMS
                                  ).formattedDelta
                                }
                                color={
                                  computeDelta(
                                    lap.lapTimeInMS,
                                    session.lapHistory[index - 1]?.lapTimeInMS
                                  ).color
                                }
                                size="small"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {dayjs
                            .duration(Number(lap.sector1TimeInMS))
                            .format("mm:ss.SSS")}
                        </TableCell>
                        <TableCell align="right">
                          {dayjs
                            .duration(Number(lap.sector2TimeInMS))
                            .format("mm:ss.SSS")}
                        </TableCell>
                        <TableCell align="right">
                          {dayjs
                            .duration(Number(lap.sector3TimeInMS))
                            .format("mm:ss.SSS")}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => setSetupDialogOpen(true)}
                            disabled={!lap.carSetup}
                          >
                            View Setup
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Stack>
          </Paper>
        </Stack>
      )}
      {!session && <CircularProgress />}
      <CarSetupDialog
        open={setupDialogOpen}
        onClose={() => setSetupDialogOpen(false)}
        setup={(session?.lapHistory?.[0] as Lap)?.carSetup}
      />
    </Container>
  );
};

export default AnalyseSessionPage;
