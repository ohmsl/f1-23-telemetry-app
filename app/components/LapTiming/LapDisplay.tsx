import { Box, Divider, Typography } from "@mui/material";

type LapDisplayProps = {
  currentLap: number | undefined;
  totalLaps: number | undefined;
};

export const LapDisplay: React.FC<LapDisplayProps> = ({
  currentLap,
  totalLaps,
}) => (
  <Box>
    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
      <Typography variant="h6" color="text.secondary">
        Lap
      </Typography>
      <Typography variant="h4">{currentLap || "--"}</Typography>
      <Typography variant="h6" color="text.secondary">{`/ ${
        totalLaps || "--"
      }`}</Typography>
    </Box>
    <Divider sx={{ mt: 1 }} />
  </Box>
);
