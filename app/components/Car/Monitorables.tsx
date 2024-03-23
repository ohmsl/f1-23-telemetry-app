import { Tyre } from "@/app/helpers/getTyreData";
import { CarDamageData } from "@/types/CarDamageData";
import { CarTelemetryData } from "@/types/CarTelemetryData";

export const Monitorables = ({
  carTelemetryData,
  carDamageData,
}: {
  carTelemetryData: CarTelemetryData | undefined;
  carDamageData: CarDamageData | undefined;
}) => {
  const determineTyreColor = (temp: number) => {
    if (temp === 0) {
      return "#000000";
    }
    // Define the base HSL values for green
    const baseHue: number = 120;
    const saturation: number = 100;
    const lightness: number = 38;

    // Define the temperature range
    const minTemp: number = 60;
    const maxTemp: number = 100;

    // Calculate the hue adjustment based on temperature
    // Adjusting the range to allow for a shift in hue based on the temperature
    const hueShiftRange: number = 20; // Max shift in hue
    const tempRange: number = maxTemp - minTemp;
    const normalizedTemp: number = (temp - minTemp) / tempRange;
    const hueAdjustment: number = (normalizedTemp - 0.5) * 2 * hueShiftRange;

    // Calculate the new hue
    const newHue: number = baseHue + hueAdjustment;

    // Return the new HSL color
    return `hsl(${newHue}, ${saturation}%, ${lightness}%)`;
  };

  const determineBrakeColor = (temp: number) => {
    if (temp === undefined) {
      return "#000000";
    }

    // Define the base HSL values for green and red
    const greenHue: number = 142;
    const redHue: number = 0;
    const saturation: number = 90;
    const lightness: number = 40;

    // Define the damage range
    const minTemp: number = 300;
    const maxTemp: number = 1000;

    // Calculate the hue adjustment based on damage
    const damageRange: number = maxTemp - minTemp;
    const normalizedDamage: number = (temp - minTemp) / damageRange;
    const hueAdjustment: number = normalizedDamage * (redHue - greenHue);

    // Calculate the new hue
    const newHue: number = greenHue + hueAdjustment;

    // Return the new HSL color
    return `hsl(${newHue}, ${saturation}%, ${lightness}%)`;
  };

  const determineEngineColor = (damage: number | undefined) => {
    if (damage === undefined) {
      return "#000000";
    }

    if (damage < 10) {
      return "#01C40A";
    }

    // Define the base HSL values for green and red
    const greenHue: number = 142;
    const redHue: number = 0;
    const saturation: number = 90;
    const lightness: number = 40;

    // Define the damage range
    const minDamage: number = 0;
    const maxDamage: number = 100;

    // Calculate the hue adjustment based on damage
    const damageRange: number = maxDamage - minDamage;
    const normalizedDamage: number = (damage - minDamage) / damageRange;
    const hueAdjustment: number = normalizedDamage * (redHue - greenHue);

    // Calculate the new hue
    const newHue: number = greenHue + hueAdjustment;

    // Return the new HSL color
    return `hsl(${newHue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <svg
      width="250"
      height="500"
      viewBox="0 0 150 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Monitorables">
        <g id="Tyres">
          <g id="RR_Tyre">
            <path
              id="Outer"
              d="M120 326.636H136C138.761 326.636 141 324.398 141 321.636V286C141 283.239 138.761 281 136 281H120C117.239 281 115 283.239 115 286V321.636C115 324.398 117.239 326.636 120 326.636Z"
              fill={determineTyreColor(
                carTelemetryData?.m_tyresSurfaceTemperature[Tyre.RearRight] || 0
              )}
              fill-opacity="0.3"
              stroke={determineTyreColor(
                carTelemetryData?.m_tyresSurfaceTemperature[Tyre.RearRight] || 0
              )}
              stroke-width="2"
            />
            <path
              id="Inner"
              d="M133.636 285.273H122.364C121.259 285.273 120.364 286.168 120.364 287.273V320.364C120.364 321.468 121.259 322.364 122.364 322.364H133.636C134.741 322.364 135.636 321.468 135.636 320.364V287.273C135.636 286.168 134.741 285.273 133.636 285.273Z"
              fill={determineTyreColor(
                carTelemetryData?.m_tyresInnerTemperature[Tyre.RearRight] || 0
              )}
            />
          </g>
          <g id="RL_Tyre">
            <path
              id="Outer_2"
              d="M14.0001 326.636H30C32.7614 326.636 35 324.398 35 321.636V286C35 283.239 32.7614 281 30 281H14.0001C11.2387 281 9.00009 283.239 9.00009 286V321.636C9.00009 324.398 11.2387 326.636 14.0001 326.636Z"
              fill={determineTyreColor(
                carTelemetryData?.m_tyresSurfaceTemperature[Tyre.RearLeft] || 0
              )}
              fill-opacity="0.3"
              stroke={determineTyreColor(
                carTelemetryData?.m_tyresSurfaceTemperature[Tyre.RearLeft] || 0
              )}
              stroke-width="2"
            />
            <path
              id="Inner_2"
              d="M27.6364 285.273H16.3636C15.2591 285.273 14.3636 286.168 14.3636 287.273V320.364C14.3636 321.468 15.2591 322.364 16.3636 322.364H27.6364C28.7409 322.364 29.6364 321.468 29.6364 320.364V287.273C29.6364 286.168 28.7409 285.273 27.6364 285.273Z"
              fill={determineTyreColor(
                carTelemetryData?.m_tyresInnerTemperature[Tyre.RearLeft] || 0
              )}
            />
          </g>
          <g id="FR_Tyre">
            <path
              id="Outer_3"
              d="M120 105H134C136.761 105 139 102.761 139 100V68C139 65.2386 136.761 63 134 63H120C117.239 63 115 65.2386 115 68V100C115 102.761 117.239 105 120 105Z"
              fill={determineTyreColor(
                carTelemetryData?.m_tyresSurfaceTemperature[Tyre.FrontRight] ||
                  0
              )}
              fill-opacity="0.3"
              stroke={determineTyreColor(
                carTelemetryData?.m_tyresSurfaceTemperature[Tyre.FrontRight] ||
                  0
              )}
              stroke-width="2"
            />
            <path
              id="Inner_3"
              d="M132 67H122C120.895 67 120 67.8954 120 69V99C120 100.105 120.895 101 122 101H132C133.105 101 134 100.105 134 99V69C134 67.8954 133.105 67 132 67Z"
              fill={determineTyreColor(
                carTelemetryData?.m_tyresInnerTemperature[Tyre.FrontRight] || 0
              )}
            />
          </g>
          <g id="FL_Tyre">
            <path
              id="Outer_4"
              d="M16.0001 105H30C32.7614 105 35 102.761 35 100V68C35 65.2386 32.7614 63 30 63H16.0001C13.2387 63 11.0001 65.2386 11.0001 68V100C11.0001 102.761 13.2387 105 16.0001 105Z"
              fill={determineTyreColor(
                carTelemetryData?.m_tyresSurfaceTemperature[Tyre.FrontLeft] || 0
              )}
              fill-opacity="0.3"
              stroke={determineTyreColor(
                carTelemetryData?.m_tyresSurfaceTemperature[Tyre.FrontLeft] || 0
              )}
              stroke-width="2"
            />
            <path
              id="Inner_4"
              d="M28 67H18C16.8954 67 16 67.8954 16 69V99C16 100.105 16.8954 101 18 101H28C29.1046 101 30 100.105 30 99V69C30 67.8954 29.1046 67 28 67Z"
              fill={determineTyreColor(
                carTelemetryData?.m_tyresInnerTemperature[Tyre.FrontLeft] || 0
              )}
            />
          </g>
        </g>
        <g id="Engine">
          <path
            d="M67.8783 197H82.1217C82.9516 197 83.6952 197.512 83.9907 198.288L87.0093 206.212C87.3048 206.988 88.0484 207.5 88.8783 207.5H93.8975C95.0413 207.5 95.9521 208.458 95.895 209.6L95.0483 226.534C95.0178 227.144 94.7102 227.707 94.2133 228.062L88.8375 231.902C88.3119 232.277 88 232.883 88 233.529V234.022C88 234.639 87.7151 235.222 87.2279 235.601L83.5 238.5L82.2785 245.829C82.1178 246.793 81.2834 247.5 80.3057 247.5H69.6043C68.6669 247.5 67.8553 246.849 67.652 245.934L66 238.5L62.683 235.598C62.249 235.218 62 234.669 62 234.092V233.529C62 232.883 61.6881 232.277 61.1625 231.902L55.7867 228.062C55.2898 227.707 54.9822 227.144 54.9517 226.534L54.105 209.6C54.0479 208.458 54.9587 207.5 56.1025 207.5H61.1217C61.9516 207.5 62.6952 206.988 62.9907 206.212L66.0093 198.288C66.3048 197.512 67.0484 197 67.8783 197Z"
            fill={determineEngineColor(carDamageData?.m_engine_damage)}
            fill-opacity="0.6"
          />
          <path
            d="M83.5 238.5L87.2279 235.601C87.7151 235.222 88 234.639 88 234.022V233.529C88 232.883 88.3119 232.277 88.8375 231.902L94.2133 228.062C94.7102 227.707 95.0178 227.144 95.0483 226.534L95.895 209.6C95.9521 208.458 95.0413 207.5 93.8975 207.5H88.8783C88.0484 207.5 87.3048 206.988 87.0093 206.212L83.9907 198.288C83.6952 197.512 82.9516 197 82.1217 197H67.8783C67.0484 197 66.3048 197.512 66.0093 198.288L62.9907 206.212C62.6952 206.988 61.9516 207.5 61.1217 207.5H56.1025C54.9587 207.5 54.0479 208.458 54.105 209.6L54.9517 226.534C54.9822 227.144 55.2898 227.707 55.7867 228.062L61.1625 231.902C61.6881 232.277 62 232.883 62 233.529V234.092C62 234.669 62.249 235.218 62.683 235.598L66 238.5M83.5 238.5H66M83.5 238.5L82.2785 245.829C82.1178 246.793 81.2834 247.5 80.3057 247.5H69.6043C68.6669 247.5 67.8553 246.849 67.652 245.934L66 238.5"
            stroke={determineEngineColor(carDamageData?.m_engine_damage)}
            stroke-width="2"
          />
        </g>
        <g id="Brakes">
          <path
            id="RR_Brake"
            d="M108 298H106C104.895 298 104 298.895 104 300V311C104 312.105 104.895 313 106 313H108C109.105 313 110 312.105 110 311V300C110 298.895 109.105 298 108 298Z"
            fill={determineBrakeColor(
              carTelemetryData?.m_brakesTemperature[3] || 0
            )}
            fill-opacity="0.6"
            stroke={determineBrakeColor(
              carTelemetryData?.m_brakesTemperature[3] || 0
            )}
            stroke-width="2"
          />
          <path
            id="RL_Brake"
            d="M44 298H42C40.8954 298 40 298.895 40 300V311C40 312.105 40.8954 313 42 313H44C45.1046 313 46 312.105 46 311V300C46 298.895 45.1046 298 44 298Z"
            fill={determineBrakeColor(
              carTelemetryData?.m_brakesTemperature[2] || 0
            )}
            fill-opacity="0.6"
            stroke={determineBrakeColor(
              carTelemetryData?.m_brakesTemperature[2] || 0
            )}
            stroke-width="2"
          />
          <path
            id="FL_Brake"
            d="M43 77H41C39.8954 77 39 77.8954 39 79V89C39 90.1046 39.8954 91 41 91H43C44.1046 91 45 90.1046 45 89V79C45 77.8954 44.1046 77 43 77Z"
            fill={determineBrakeColor(
              carTelemetryData?.m_brakesTemperature[1] || 0
            )}
            fill-opacity="0.6"
            stroke={determineBrakeColor(
              carTelemetryData?.m_brakesTemperature[1] || 0
            )}
            stroke-width="2"
          />
          <path
            id="FR_Brake"
            d="M109 77H107C105.895 77 105 77.8954 105 79V89C105 90.1046 105.895 91 107 91H109C110.105 91 111 90.1046 111 89V79C111 77.8954 110.105 77 109 77Z"
            fill={determineBrakeColor(
              carTelemetryData?.m_brakesTemperature[0] || 0
            )}
            fill-opacity="0.6"
            stroke={determineBrakeColor(
              carTelemetryData?.m_brakesTemperature[0] || 0
            )}
            stroke-width="2"
          />
        </g>
      </g>
    </svg>
  );
};
