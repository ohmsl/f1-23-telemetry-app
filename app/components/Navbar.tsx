import { ChevronLeft, ChevronRight, Notifications } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Badge,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Popover,
  Stack,
  Toolbar,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { useNotifications } from "../providers/NotificationProvider";
import { useVehicleTelemetry } from "../providers/telemetry/TelemetryProvider";
dayjs.extend(relativeTime);

type Props = {
  vehicleIndex: number;
  setVehicleIndex: (index: number) => void;
};

const Navbar = ({ vehicleIndex, setVehicleIndex }: Props) => {
  const { deleteNotification, notifications } = useNotifications();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const { participantsData } = useVehicleTelemetry(vehicleIndex);

  return (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
      variant="dense"
    >
      <div>
        {`${vehicleIndex + 1} /
                ${participantsData?.m_numActiveCars || 1} - 
                ${
                  participantsData?.m_participants[vehicleIndex]?.m_name ||
                  "Unavailable"
                }`}
        <IconButton
          onClick={() => {
            if (vehicleIndex > 0) {
              setVehicleIndex(vehicleIndex - 1);
            }
          }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={() => {
            if (vehicleIndex < (participantsData?.m_numActiveCars || 1) - 1) {
              setVehicleIndex(vehicleIndex + 1);
            }
          }}
        >
          <ChevronRight />
        </IconButton>
      </div>
      <IconButton size="large" onClick={handleNotificationsClick}>
        <Badge badgeContent={notifications.length} color="error">
          <Notifications sx={{ fontSize: 30 }} />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper>
          <List>
            {notifications.map((notification, index) => (
              <ListItem key={index} divider={index < notifications.length - 1}>
                <ListItemText
                  primary={notification.message}
                  secondary={dayjs(notification.timestamp).fromNow()}
                />
                <Stack direction="row" pl={2}>
                  {notification.action && (
                    <IconButton
                      onClick={notification.action.onClick}
                      title={notification.action.label}
                      size="small"
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() => {
                      deleteNotification(notification.timestamp);
                    }}
                    title="Dismiss"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </ListItem>
            ))}
            {notifications.length === 0 && (
              <ListItem>
                <ListItemText primary="No notifications" />
              </ListItem>
            )}
          </List>
        </Paper>
      </Popover>
    </Toolbar>
  );
};

export default Navbar;
