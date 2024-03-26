"use client";
import { SnackbarProvider as NotistackProvider } from "notistack";
import React from "react";

const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NotistackProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      {children}
    </NotistackProvider>
  );
};

export default SnackbarProvider;
