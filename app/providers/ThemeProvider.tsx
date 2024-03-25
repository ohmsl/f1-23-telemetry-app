"use client";
import theme from "@/theme/theme";
import {
  Box,
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  Theme,
} from "@mui/material";
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
          height: isMobile ? "100%" : "100vh",
          justifyContent: "center",
          overflowY: "auto",
          overflowX: "hidden",
          flexWrap: "wrap",
          py: 8,
        }}
      >
        {children}
      </Box>
    </MuiThemeProvider>
  );
}
