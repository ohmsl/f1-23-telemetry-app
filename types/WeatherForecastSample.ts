export interface WeatherForecastSample {
  m_sessionType: number; // u8
  m_timeOffset: number; // u8
  m_weather: number; // u8
  m_trackTemperature: number; // i8
  m_trackTemperatureChange: number; // i8
  m_airTemperature: number; // i8
  m_airTemperatureChange: number; // i8
  m_rainPercentage: number; // u8
}
