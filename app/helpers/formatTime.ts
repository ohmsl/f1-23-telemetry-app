import dayjs from "dayjs";

export const formatTime = (
  value: number | undefined,
  unit: "m" | "s" | "ms" = "ms"
) => {
  if (!value) {
    return "--:--";
  }
  return dayjs.duration(value, unit).format("m:ss.SSS");
};
