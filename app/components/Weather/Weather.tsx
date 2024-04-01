import { PacketSessionData } from "@/types/PacketSessionData";
import { WeatherForecastSample } from "@/types/WeatherForecastSample";
import { Box, Divider, Stack, Typography } from "@mui/material";
import {
  BsCloudLightningRainFill,
  BsCloudRainFill,
  BsCloudRainHeavyFill,
  BsCloudsFill,
  BsCloudyFill,
  BsFillQuestionCircleFill,
  BsSunFill,
} from "react-icons/bs";
import WeatherSample from "./WeatherSample";

const parseWeatherType = (weather: number, icon: boolean = false) => {
  switch (weather) {
    case 0:
      return icon ? <BsSunFill size={24} /> : "Clear";
    case 1:
      return icon ? <BsCloudsFill size={24} /> : "Partly Cloudy";
    case 2:
      return icon ? <BsCloudyFill size={24} /> : "Cloudy";
    case 3:
      return icon ? <BsCloudRainFill size={24} /> : "Light Rain";
    case 4:
      return icon ? <BsCloudRainHeavyFill size={24} /> : "Heavy Rain";
    case 5:
      return icon ? <BsCloudLightningRainFill size={24} /> : "Thunderstorm";
    default:
      return icon ? <BsFillQuestionCircleFill size={24} /> : "Unavailable";
  }
};

const parseWeatherForecast = (
  forecast: Array<WeatherForecastSample> | undefined,
  sessionType?: number
) => {
  forecast = forecast?.filter(
    (sample) =>
      sample.m_sessionType !== 0 && sample.m_sessionType === sessionType
  );

  return forecast?.map((sample) => {
    return {
      icon: parseWeatherType(sample.m_weather, true) as JSX.Element,
      ...sample,
    };
  });
};

type WeatherProps = {
  sessionData: PacketSessionData | undefined;
};

const Weather = ({ sessionData }: WeatherProps) => {
  return (
    <Stack direction="row" alignItems="center" spacing={3}>
      <Box>
        <Typography variant="h6" sx={{ textWrap: "nowrap" }}>
          {parseWeatherType(
            sessionData?.m_weatherForecastSamples[0]?.m_weather ?? 256
          )}
        </Typography>
        <Typography variant="h4">{sessionData?.m_airTemperature}°C</Typography>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box>
        <Typography variant="h6">Track</Typography>
        <Typography variant="h4">
          {sessionData?.m_trackTemperature}°C
        </Typography>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box sx={{ display: "flex", gap: 2 }}>
        {parseWeatherForecast(
          sessionData?.m_weatherForecastSamples,
          sessionData?.m_sessionType
        )?.map((weather, index) => (
          <WeatherSample key={index} weather={weather} />
        ))}
      </Box>
    </Stack>
  );
};

export default Weather;
