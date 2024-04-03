"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import React, { createContext, useState } from "react";

type Severity = "info" | "success" | "warning" | "error";

type DialogProviderProps = {
  children: React.ReactNode;
};

type DialogContextType = {
  showDialog: (component: React.ReactNode, props?: DialogProps) => void;
  showPrompt: (message: string, title: string, severity: Severity) => void;
};

export const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};

export const DialogContext = createContext<DialogContextType | undefined>(
  undefined
);

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
    null
  );
  const [dialogProps, setDialogProps] = useState<Omit<DialogProps, "open">>({});

  const showDialog = (
    component: React.ReactNode,
    props?: Omit<DialogProps, "open">
  ) => {
    setDialogContent(component);
    setDialogProps(props || {});
  };

  const handleClose = () => {
    setDialogContent(null);
  };

  const showPrompt = (message: string, title: string, severity: Severity) => {
    // Implement your logic to show the prompt using a toast or a custom dialog component
    // You can use libraries like react-toastify or create your own custom component
    // Here's an example using MUI Dialog:
    showDialog(
      <>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{message}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </>,
      { maxWidth: "sm" }
    );
  };

  return (
    <DialogContext.Provider value={{ showDialog, showPrompt }}>
      {children}
      {dialogContent && (
        <Dialog
          open
          onClose={() => setDialogContent(null)}
          {...dialogProps}
          PaperProps={{
            sx: { background: (theme) => theme.palette.background.paper },
          }}
        >
          {dialogContent}
        </Dialog>
      )}
    </DialogContext.Provider>
  );
};
