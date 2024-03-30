// GForceIndicator.tsx
import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface GForceIndicatorProps {
  gForceLateral: number;
  gForceLongitudinal: number;
}

interface Point {
  x: number;
  y: number;
}

const maxGForce = 5; // Adjust this to set the maximum G-Force value expected
const maxHistorySize = 35; // Maximum number of points in the history

const GForceIndicator: React.FC<GForceIndicatorProps> = ({
  gForceLateral,
  gForceLongitudinal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [history, setHistory] = useState<Point[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const point: Point = {
      x: gForceLateral,
      y: gForceLongitudinal,
    };

    setHistory((prevHistory) => {
      const newHistory =
        prevHistory.length >= maxHistorySize
          ? prevHistory.slice(1)
          : prevHistory;
      return [...newHistory, point];
    });
  }, [gForceLateral, gForceLongitudinal]);

  useEffect(() => {
    const animate = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (canvas && context) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scaleFactor = canvas.width / (2 * maxGForce);

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw concentric circles
        for (let i = 1; i <= maxGForce; i++) {
          context.beginPath();
          context.arc(centerX, centerY, scaleFactor * i, 0, 2 * Math.PI);
          context.strokeStyle = theme.palette.text.disabled;
          context.stroke();
        }

        if (history.length > 0) {
          // Draw the path of G-force history
          context.beginPath();
          context.moveTo(
            centerX + history[0].x * scaleFactor,
            centerY - history[0].y * scaleFactor
          );
          for (let i = 1; i < history.length; i++) {
            context.lineTo(
              centerX + history[i].x * scaleFactor,
              centerY - history[i].y * scaleFactor
            );
          }
          context.strokeStyle = theme.palette.error.main;
          context.lineWidth = 2;
          context.stroke();
        }

        // Draw the current G-force point
        context.beginPath();
        context.arc(
          centerX + gForceLateral * scaleFactor,
          centerY - gForceLongitudinal * scaleFactor,
          5,
          0,
          2 * Math.PI
        );
        context.fillStyle = theme.palette.error.main;
        context.fill();
      }

      requestAnimationFrame(animate);
    };
    animate();
  }, [history, gForceLateral, gForceLongitudinal, theme.palette]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography variant="body2" color="textSecondary">
        Lateral: {gForceLateral.toFixed(2)}g
      </Typography>
      <canvas ref={canvasRef} width="200" height="200" />
      <Typography variant="body2" color="textSecondary">
        Longitudinal: {gForceLongitudinal.toFixed(2)}g
      </Typography>
    </Box>
  );
};

export default GForceIndicator;
