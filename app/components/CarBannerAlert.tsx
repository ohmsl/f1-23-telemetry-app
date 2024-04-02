import { Box, Typography, useTheme } from "@mui/material";

type Props = {
  message: string;
  severity?: "error" | "warning" | "info" | "success" | "default";
  subtitle?: string;
  invertColors?: boolean;
  backgroundOverride?: string;
  pulse?: boolean;
};

const CarBannerAlert = ({
  message,
  severity,
  subtitle,
  invertColors,
  backgroundOverride,
  pulse,
}: Props) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1,
        width: invertColors ? "100%" : "auto",
        px: 12,
        py: 2,
        background: backgroundOverride
          ? backgroundOverride
          : invertColors
          ? theme.palette[severity !== "default" ? severity || "info" : "info"]
              .main
          : "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.8), transparent)",
        "@keyframes pulse": {
          "0%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0.5,
          },
          "100%": {
            opacity: 1,
          },
        },
        textWrap: "nowrap",
        borderTop: invertColors ? "1px solid rgba(0, 0, 0, 0.12)" : "none",
        borderBottom: invertColors ? "1px solid rgba(0, 0, 0, 0.12)" : "none",
      }}
    >
      {subtitle && (
        <Typography
          variant="h6"
          align="center"
          sx={{
            color: invertColors ? theme.palette.warning.main : "#fff",
            textTransform: "uppercase",
            letterSpacing: 2,
            fontWeight: "bold",
            background: invertColors ? "#000" : "transparent",
          }}
        >
          {subtitle}
        </Typography>
      )}
      <Typography
        variant="h4"
        align="center"
        sx={{
          color: invertColors
            ? "#000"
            : severity === "default"
            ? "#fff"
            : theme.palette[severity || "info"].main,
          textTransform: "uppercase",
          letterSpacing: 2,
          fontWeight: "bold",
          animation: pulse ? "pulse 2s infinite" : "none",
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default CarBannerAlert;
