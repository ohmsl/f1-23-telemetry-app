"use client";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useDialog } from "../providers/DialogProvider";
import { speak } from "./helpers/speak";
import { useOpenAI } from "./useOpenAI";
dayjs.extend(LocalizedFormat);

const AIPage = () => {
  const { showPrompt } = useDialog();
  const { thread, createThread, sendMessage, run, messages, processing } =
    useOpenAI();
  const [log, setLog] = useState<Array<string>>([]);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  console.log("messages", messages);
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      showPrompt(
        "Browser does not support speech recognition.",
        "Unsupported Browser",
        "error"
      );
    } else if (!isMicrophoneAvailable) {
      showPrompt(
        "Microphone is not available. Please enable it and try again.",
        "Microphone not available",
        "error"
      );
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable, showPrompt]);

  const handlePushToTalk = async () => {
    if (listening) {
      setLog((log) => [
        ...log,
        "Stopped listening",
        `Transcript: ${transcript}`,
      ]);

      await SpeechRecognition.stopListening();

      if (!thread?.id) {
        await createThread(transcript);
      } else {
        await sendMessage(
          thread.id,
          `Current Car Telemetry: {"m_speed":182,"m_throttle":0,"m_steer":-0.13273686170578003,"m_brake":0.8138486742973328,"m_clutch":0,"m_gear":5,"m_engineRPM":9085,"m_drs":0,"m_revLightsPercent":0,"m_revLightsBitValue":0,"m_brakesTemperature":[884,884,941,943],"m_tyresSurfaceTemperature":[97,95,97,97],"m_tyresInnerTemperature":[89,87,84,84],"m_engineTemperature":118,"m_tyresPressure":[21.5,21.5,23.5,23.5],"m_surfaceType":[0,0,0,0]}
Driver Query: ${transcript}`
        );
        const response = await run(thread.id);
        const messageContent =
          response?.[0]?.content[0].type === "text"
            ? response?.[0]?.content[0].text.value
            : "Image";

        console.log("messageContent", messageContent);
        speak(messageContent);
      }
      resetTranscript();
    } else {
      setLog((log) => [...log, "Started listening"]);
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        bgcolor: "black",
        mx: 2,
        p: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        F1 AI Engineer
      </Typography>
      <Stack justifyContent="flex-end" flexGrow={1}>
        <Stack py={2}>
          {messages?.reverse().map((message, idx) => {
            const messageContent =
              message.content[0].type === "text"
                ? message.content[0].text.value
                : "Image";

            return (
              <Typography key={idx} variant="body2" fontFamily="Fira Code">
                {`${dayjs.unix(message.created_at).format("L LTS")} - [ ${
                  message.role
                } ] - ${messageContent} `}
              </Typography>
            );
          })}
        </Stack>
        <Stack direction="row" gap={2}>
          <TextField
            placeholder="Live transcript will appear here"
            value={transcript}
            fullWidth
            disabled
          />
          <Button
            variant="contained"
            color="info"
            onMouseDown={handlePushToTalk}
            onMouseUp={handlePushToTalk}
            disabled={processing}
          >
            {listening ? "Release to Stop" : "Hold to Talk"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default AIPage;
