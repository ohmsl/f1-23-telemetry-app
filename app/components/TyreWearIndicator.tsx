import {
  Box,
  CircularProgress,
  CircularProgressProps,
  Typography,
} from "@mui/material";

const TyreWearIndicator = (
  props: CircularProgressProps & { value: number }
) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        size={64}
        thickness={7}
        {...props}
        sx={{
          // make the circle thicker
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
          "&:before": {
            content: '""',
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            borderColor: (theme) => theme.palette.background.paper,
            borderStyle: "solid",
            borderWidth: 10,
            zIndex: -1,
          },
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body2"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};

export default TyreWearIndicator;
