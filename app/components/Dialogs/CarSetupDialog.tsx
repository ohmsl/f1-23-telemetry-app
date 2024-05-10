import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { CarSetup } from "@prisma/client";

type Props = {
  open: boolean;
  onClose: () => void;
  setup: CarSetup | null | undefined;
};

const CarSetupDialog = ({ open, onClose, setup }: Props) => {
  console.log(setup);
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Car Setup</DialogTitle>
      <DialogContent>
        {!setup && (
          <Typography color="textSecondary">No setup data available</Typography>
        )}
        <pre>{JSON.stringify(setup, null, 2)}</pre>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarSetupDialog;
