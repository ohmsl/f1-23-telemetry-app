import type { Metadata } from "next";
import { DialogProvider } from "./providers/DialogProvider";
import { NotificationProvider } from "./providers/NotificationProvider";
import SnackbarProvider from "./providers/SnackbarProvider";
import ThemeProvider from "./providers/ThemeProvider";

export const metadata: Metadata = {
  title: "F1 Telemetry",
  description: "F1 Telemetry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <DialogProvider>
            <SnackbarProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </SnackbarProvider>
          </DialogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
