"use client";
import { AlertProps, Alert as MuiAlert } from "@mui/material";
import {
  CustomContentProps,
  SnackbarProvider as NotistackProvider,
} from "notistack";
import React from "react";

interface CustomAlertProps extends CustomContentProps {
  severity: AlertProps["severity"];
}

const Alert = React.forwardRef<HTMLDivElement, CustomAlertProps>(
  (props, ref) => {
    const { message, variant, severity, style } = props;
    return (
      <MuiAlert
        ref={ref}
        elevation={2}
        variant="standard"
        severity={
          severity ? severity : variant === "default" ? "info" : variant
        }
        sx={{
          display: "flex",
          alignItems: "center",
          boxShadow: 12,
          fontFamily: "Roboto",
          fontSize: 16,
        }}
        style={style}
      >
        {message}
      </MuiAlert>
    );
  }
);
Alert.displayName = "Alert";

const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NotistackProvider
      maxSnack={1}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      Components={{
        success: Alert,
        error: Alert,
        warning: Alert,
        info: Alert,
        default: Alert,
      }}
    >
      {children}
    </NotistackProvider>
  );
};

export default SnackbarProvider;
