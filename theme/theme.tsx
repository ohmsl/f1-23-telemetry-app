"use client";
import "@fontsource/dm-sans";
import "@fontsource/noto-sans";
import { darkScrollbar } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import localFont from "next/font/local";

declare module "@mui/material/styles" {
  interface SimplePaletteColorOptions {
    gradient?: string;
  }
  interface PaletteColor {
    gradient?: string;
  }
  interface TypeBackground {
    defaultGradient?: string;
    paperGradient?: string;
  }
  // allow configuration using `createTheme`
  interface Palette {
    primary: PaletteColor;
    secondary: PaletteColor;
  }
}

const f1Font = localFont({
  src: "../fonts/Formula1-Regular-1.ttf",
});

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#0f1b2a",
      defaultGradient:
        "linear-gradient(215deg,#0b101e 15%,#000 85%) no-repeat 50% fixed",
      paperGradient:
        "linear-gradient(215deg,#0b101e 15%,#000 85%) no-repeat 50% fixed",
    },
    primary: {
      main: "#2cdb75",
      gradient: "linear-gradient(145deg, #2cdb75, #1AAB4A)",
    },
    secondary: {
      main: "#AB00DC",
      gradient: "linear-gradient(145deg, #AB00DC, #7A5FFF)",
    },
    error: {
      main: "#EF3265",
      gradient: "linear-gradient(145deg, #EF3265, #B8002E)",
    },
    success: {
      main: "#2cdb75",
      gradient: "linear-gradient(145deg, #2cdb75, #1AAB4A)",
    },
    warning: {
      main: "#f89a00",
      gradient: "linear-gradient(145deg, #FFBE7D, #FF7F00)",
    },
    info: {
      main: "#b2a5ff",
      gradient: "linear-gradient(145deg, #b2a5ff, #7A5FFF)",
    },
    text: {
      primary: "rgb(255, 255, 255)",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: f1Font.style.fontFamily,
    caption: {
      fontFamily: "'Poppins', Arial, Helvetica, sans-serif",
      fontWeight: 400,
    },
  },
  components: {
    MuiPaper: {
      // background should be paper gradient
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255, 255, 255, 0.12)",
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides(theme) {
        return {
          html: {
            WebkitFontSmoothing: "auto",
          },
          body: {
            maxWidth: "100vw",
            overflowX: "hidden",
            backgroundColor: theme.palette.background.default,
            background: theme.palette.background.defaultGradient,
            body: darkScrollbar(),
          },
          a: {
            fontWeight: 600,
            textDecoration: "none",
            borderBottom: "1px solid rgba(255, 255, 255, 0.5)",
          },
        };
      },
    },
  },
});

export default theme;
