import SquareIcon from "@mui/icons-material/SquareRounded";
import {
  Box,
  Divider,
  Stack,
  SvgIconProps,
  SxProps,
  Typography,
} from "@mui/material";

type StatStackProps = {
  title: string;
  stats: Array<{
    title: string;
    value: string;
    color: SvgIconProps["color"];
  }>;
  align?: "center" | "left" | "right";
  sx?: SxProps;
};

const StatStack = ({ title, stats, align = "left", sx }: StatStackProps) => {
  return (
    <Stack textAlign={align} sx={{ ...sx }}>
      <Typography letterSpacing={2} variant="body2">
        {title}
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <Stack direction="row" spacing={2}>
        {stats.map((stat) => (
          <Stack key={stat.title}>
            <Box display="flex" gap={0.5}>
              <SquareIcon color={stat.color} sx={{ fontSize: 18 }} />
              <Typography variant="caption" color="textSecondary">
                {stat.title}
              </Typography>
            </Box>
            <Typography variant="body1">{stat.value}</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default StatStack;
