import type { Metadata } from "next";
import localFont from "next/font/local";
import { AlertProvider } from "./providers/AlertProvider";
import ThemeProvider from "./providers/ThemeProvider";
import { TelemetryProvider } from "./providers/telemetry/TelemetryProvider";

const f1Font = localFont({
  src: "./Formula1-Regular-1.ttf",
});

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
      <body className={f1Font.className}>
        <ThemeProvider>
          <AlertProvider>
            <TelemetryProvider>{children}</TelemetryProvider>
          </AlertProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
