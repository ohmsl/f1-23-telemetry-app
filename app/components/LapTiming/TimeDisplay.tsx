import { formatTime } from "@/app/helpers/formatLapTime";
import {
  Box,
  Chip,
  ChipProps,
  Stack,
  Typography,
  TypographyProps,
} from "@mui/material";

type TimeDisplayProps = {
  label: string;
  time: number | undefined;
  driverStatus?: string;
  labelColor?: TypographyProps["color"];
  chipText?: string;
  chipColor?: ChipProps["color"];
  isLastLapsTime?: boolean;
};

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  label,
  time,
  driverStatus,
  labelColor,
  chipText,
  chipColor = "default",
  isLastLapsTime,
}) => (
  <Box>
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="h6" color="text.secondary">
        {label}
      </Typography>
      {isLastLapsTime && <Chip label="Last" color="default" size="small" />}
    </Stack>
    <Typography variant="h4" color={labelColor || "text.primary"}>
      {driverStatus ? driverStatus : formatTime(time)}
    </Typography>
    {chipText && <Chip label={chipText} color={chipColor} size="small" />}
  </Box>
);
