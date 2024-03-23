import type { Metadata } from "next";
import { AlertProvider } from "./providers/AlertProvider";
import ThemeProvider from "./providers/ThemeProvider";
import { TelemetryProvider } from "./providers/telemetry/TelemetryProvider";

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
          <AlertProvider>
            <TelemetryProvider>{children}</TelemetryProvider>
          </AlertProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
