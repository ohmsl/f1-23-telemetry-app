import { Box, Typography } from "@mui/material";

type LapDisplayProps = {
  currentLap: number | undefined;
  totalLaps: number | undefined;
};

export const LapDisplay: React.FC<LapDisplayProps> = ({
  currentLap,
  totalLaps,
}) => (
  <Box>
    <Box sx={{ display: "flex", gap: 1 }}>
      <Typography variant="h4">{currentLap || "--"}</Typography>
      <Typography variant="h6" color="text.secondary">{`/ ${
        totalLaps || "--"
      }`}</Typography>
    </Box>
  </Box>
);
