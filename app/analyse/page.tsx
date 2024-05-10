"use client";
import { ChevronRight } from "@mui/icons-material";
import {
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Session } from "@prisma/client";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import parseTrackId from "../helpers/parseTrackId";

const AnalysePage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [sessions, setSessions] = useState<Array<Session>>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      const response = await fetch("http://localhost:9000/sessions");
      const data: Array<Session> = await response.json();
      setSessions(data);
      setLoading(false);
    };
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
  }, []);

  const handleSessionClick = (id: string) => {
    router.push(`/analyse/${id}`);
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={2} width="100%" px={2}>
        <Paper sx={{ p: 2 }} variant="outlined">
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4" gutterBottom>
              Session Analysis
            </Typography>
          </Stack>
          <Paper sx={{ overflow: "hidden" }}>
            <List>
              {sessions.reverse().map((session) => (
                <ListItem key={session.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleSessionClick(session.id.toString())}
                  >
                    <ListItemText
                      primary={dayjs(session.createdAt).format(
                        "DD/MM/YYYY HH:mm:ss"
                      )}
                      secondary={parseTrackId(session.trackId)}
                    />
                    <ChevronRight />
                  </ListItemButton>
                </ListItem>
              ))}
              {sessions.length === 0 && !loading && (
                <ListItem>
                  <ListItemText primary="No sessions yet" />
                </ListItem>
              )}
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Paper>
        </Paper>
      </Stack>
    </Container>
  );
};

export default AnalysePage;
