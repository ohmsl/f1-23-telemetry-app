import { WeatherForecastSample } from "@/types/WeatherForecastSample";
import { Paper, Typography } from "@mui/material";

type WeatherSampleProps = {
  weather: WeatherForecastSample & {
    icon: JSX.Element;
  };
};

const WeatherSample = ({ weather }: WeatherSampleProps) => {
  const isNow = weather.m_timeOffset === 0;
  return (
    <Paper
      sx={{
        p: 1.5,
        px: 1,
        gap: 0.5,
        minWidth: 56,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
      elevation={isNow ? 6 : 3}
    >
      {weather.icon}
      <Typography variant="caption">
        {isNow ? "Now" : `+${weather.m_timeOffset}m`}
      </Typography>
      <Typography variant="body2">{weather.m_airTemperature}°</Typography>
    </Paper>
  );
};

export default WeatherSample;
