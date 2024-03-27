import dayjs from "dayjs";

export const formatTime = (milliseconds: number | undefined): string => {
  if (!milliseconds) {
    return "--:--";
  }
  return dayjs.duration(milliseconds, "milliseconds").format("m:ss.SSS");
};
