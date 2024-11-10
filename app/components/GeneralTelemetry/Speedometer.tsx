import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import {
  GaugeContainer,
  GaugeReferenceArc,
  GaugeValueArc,
} from "@mui/x-charts";

export const Speedometer = ({
  speed,
  rpm,
  throttle,
  brakes,
  drs,
  ersEnabled,
}: {
  speed: number;
  rpm: number;
  throttle: number;
  brakes: number;
  drs: {
    allowed: boolean;
    enabled: boolean;
  };
  ersEnabled: boolean;
}) => {
  const theme = useTheme();
  const mph = Math.round(speed * 0.621371);

  return (
    <Box
      position="relative"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      width="300px"
      height="250px"
    >
      <GaugeContainer
        value={rpm}
        valueMax={13500}
        startAngle={-130}
        endAngle={130}
        cornerRadius={4}
        margin={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <GaugeValueArc style={{ fill: theme.palette.info.main }} />
        <GaugeReferenceArc />
      </GaugeContainer>
      <GaugeContainer
        value={throttle}
        valueMax={1}
        cy="60.5%"
        cx="50%"
        innerRadius="60%"
        outerRadius="75%"
        sx={{ position: "absolute" }}
        startAngle={-130}
        endAngle={43}
        cornerRadius={4}
        margin={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <GaugeValueArc />
        <GaugeReferenceArc />
      </GaugeContainer>
      <GaugeContainer
        value={brakes}
        valueMax={1}
        cy="60.5%"
        cx="50%"
        innerRadius="60%"
        outerRadius="75%"
        sx={{ position: "absolute" }}
        startAngle={46}
        endAngle={130}
        cornerRadius={4}
        margin={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <GaugeValueArc style={{ fill: theme.palette.error.main }} />
        <GaugeReferenceArc />
      </GaugeContainer>
      <Box
        top={70}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h4" fontWeight="bold">
          {mph}
        </Typography>
        <Typography variant="subtitle2">MPH</Typography>
        <Typography variant="h6">{rpm}</Typography>
        <Typography variant="subtitle2">RPM</Typography>
        <Stack direction="row" spacing={1} mt={1}>
          <Chip
            label="DRS"
            color={drs.allowed ? "info" : drs.enabled ? "success" : "default"}
          />
          <Chip label="ERS" color={ersEnabled ? "success" : "default"} />
        </Stack>
      </Box>
    </Box>
  );
};
