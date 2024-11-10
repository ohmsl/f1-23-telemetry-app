"use client";
import theme from "@/theme/theme";
import {
  Box,
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  Theme,
} from "@mui/material";
import "regenerator-runtime/runtime";
import useIsMobile from "../hooks/useIsMobile";

export default function ThemeProvider({
  children,
  themeOverride,
}: {
  children: React.ReactNode;
  themeOverride?: Theme;
}) {
  const isMobile = useIsMobile();

  return (
    <MuiThemeProvider theme={themeOverride ? themeOverride : theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          overflow: "hidden",
          flexWrap: "wrap",
          py: 4,
        }}
      >
        {children}
      </Box>
    </MuiThemeProvider>
  );
}
