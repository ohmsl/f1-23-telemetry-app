import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Cancel from "@mui/icons-material/Cancel";
import CheckCircle from "@mui/icons-material/CheckCircle";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { Box, Chip, IconButton, Menu, MenuItem } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useVehicleTelemetry } from "../providers/telemetry/TelemetryProvider";

const ConnectedChip = () => {
  const { connected } = useVehicleTelemetry();
  console.log("chip rendered");

  const [clicks, setClicks] = useState(0);
  const [devMode, setDevMode] = useState(false);
  const [devMenuAnchor, setDevMenuAnchor] = useState<null | HTMLElement>(null);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (clicks > 4) {
      setDevMode(true);
    }
    if (clicks > 5) {
      setDevMode(false);
      setClicks(0);
    }
  }, [clicks]);

  return (
    <Box
      sx={{
        position: "fixed",
        display: "flex",
        top: 0,
        left: 0,
        m: 2,
        gap: 1,
        zIndex: 9999,
      }}
    >
      <Chip
        sx={{ boxShadow: 8 }}
        label={connected ? "Connected" : "Disconnected"}
        color={connected ? "success" : "error"}
        icon={
          devMode ? (
            <SettingsSuggestIcon />
          ) : connected ? (
            <CheckCircle />
          ) : (
            <Cancel />
          )
        }
        onClick={() => setClicks(clicks + 1)}
      />
      {devMode && (
        <IconButton onClick={(e) => setDevMenuAnchor(e.currentTarget)}>
          {devMenuAnchor ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      )}
      <Menu
        open={!!devMenuAnchor}
        onClose={() => setDevMenuAnchor(null)}
        anchorEl={devMenuAnchor}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            enqueueSnackbar("This is a test notification", {
              variant: "success",
            });
            setDevMenuAnchor(null);
          }}
        >
          enqueueSnackbar success
        </MenuItem>
        <MenuItem
          onClick={() => {
            enqueueSnackbar("This is a test notification", {
              variant: "error",
            });
            setDevMenuAnchor(null);
          }}
        >
          enqueueSnackbar error
        </MenuItem>
        <MenuItem
          onClick={() => {
            enqueueSnackbar(
              "This is a test notification with a long message that will wrap to the next line",
              {
                variant: "warning",
              }
            );
            setDevMenuAnchor(null);
          }}
        >
          enqueueSnackbar warning
        </MenuItem>
        <MenuItem
          onClick={() => {
            enqueueSnackbar("This is a test notification", {
              variant: "info",
            });
            setDevMenuAnchor(null);
          }}
        >
          enqueueSnackbar info
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ConnectedChip;
