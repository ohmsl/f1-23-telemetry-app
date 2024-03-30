"use client";
import getTeam from "@/app/helpers/getTeam";
import { useTelemetry } from "@/app/providers/telemetry/TelemetryProvider";
import { FinalClassificationData } from "@/types/FinalClassificationData";
import { PacketSessionData } from "@/types/PacketSessionData";
import { ParticipantData } from "@/types/ParticipantData";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Chip,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Typography,
} from "@mui/material";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo } from "react";
dayjs.extend(relativeTime);
dayjs.extend(duration);

const ResultsPage = ({ params }: { params: { sessionId: string } }) => {
  const { sessionId } = params;
  const { connected } = useTelemetry();

  const localStorageData = useMemo(() => {
    return JSON.parse(localStorage.getItem("finalClassification") || "{}") as {
      [key: string]: {
        timestamp: number;
        sessionData: PacketSessionData;
        data: Array<{
          finalClassificationData: FinalClassificationData;
          participantsData: ParticipantData;
        }>;
      };
    };
  }, []);

  const session = localStorageData[sessionId];
  if (!session)
    return (
      <Container maxWidth="xl">
        <Paper sx={{ p: 2 }} variant="outlined">
          <Typography variant="h4">Session not found</Typography>
        </Paper>
      </Container>
    );

  const data = session.data;
  return (
    <>
      <Chip
        sx={{ position: "fixed", top: 0, right: 0, m: 2, boxShadow: 8 }}
        label={connected ? "Connected" : "Disconnected"}
        color={connected ? "success" : "error"}
        icon={connected ? <CheckCircleIcon /> : <CancelIcon />}
      />
      <Container maxWidth="xl">
        <Stack spacing={2} width="100%" px={2}>
          <Paper sx={{ p: 2 }} variant="outlined">
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4" gutterBottom>
                Results
              </Typography>
              <Typography variant="h6">
                {dayjs(session.timestamp).format("DD/MM/YYYY - HH:mm")}
              </Typography>
            </Stack>
            <Paper sx={{ width: "100%", overflow: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pos.</TableCell>
                    <TableCell>Driver</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Laps</TableCell>
                    <TableCell>Grid</TableCell>
                    <TableCell>Points</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data
                    .sort(
                      (a, b) =>
                        a.finalClassificationData.m_position -
                        b.finalClassificationData.m_position
                    )
                    .map(
                      ({
                        finalClassificationData: classification,
                        participantsData,
                      }) => (
                        <TableRow key={classification.m_position}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography>
                                {classification.m_position}
                              </Typography>
                              {classification.m_position >
                              classification.m_gridPosition ? (
                                <ArrowDropDownIcon
                                  color="error"
                                  sx={{ fontSize: 32 }}
                                />
                              ) : classification.m_position <
                                classification.m_gridPosition ? (
                                <ArrowDropUpIcon
                                  color="success"
                                  sx={{ fontSize: 32 }}
                                />
                              ) : null}
                            </Box>
                          </TableCell>
                          <TableCell>{participantsData.m_name}</TableCell>
                          <TableCell>
                            {getTeam(participantsData.m_teamId)}
                          </TableCell>
                          <TableCell>
                            {dayjs
                              .duration(36893488147419103000, "seconds")
                              .format("mm:ss.SSS")}
                          </TableCell>
                          <TableCell>{classification.m_numLaps}</TableCell>
                          <TableCell>{classification.m_gridPosition}</TableCell>
                          <TableCell>{classification.m_points}</TableCell>
                        </TableRow>
                      )
                    )}
                </TableBody>
              </Table>
            </Paper>
          </Paper>
        </Stack>
      </Container>
    </>
  );
};

export default ResultsPage;
