import { Box, Typography } from "@mui/material";

function SearchResultHeader({ count }) {
  return (
    <Box
      sx={{
        mt: 4,
        mb: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
      >
        Knowledge Repository ({count})
      </Typography>
    </Box>
  );
}

export default SearchResultHeader;