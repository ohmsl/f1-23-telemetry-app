import { ChipProps } from "@mui/material";

export const computeDelta = (
  lapTime: number,
  personalBestLapTime: number | undefined
): {
  formattedDelta: string;
  color: ChipProps["color"];
} => {
  if (!personalBestLapTime) {
    return { formattedDelta: "-.---", color: "default" };
  }

  const delta = lapTime - personalBestLapTime;
  const formattedDelta = `${delta > 0 ? "+" : ""}${(delta / 1000).toFixed(3)}`;
  const color: ChipProps["color"] =
    delta > 0 ? "error" : delta < 0 ? "success" : "default";

  return { formattedDelta, color };
};
