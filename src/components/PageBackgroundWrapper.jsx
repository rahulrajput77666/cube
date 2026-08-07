import { Box } from "@mui/material";

const PageBackgroundWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        backgroundImage: "url('/backgroundlogo.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundColor: "#E2E8F0",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(248, 250, 252, 0.12)",
          backdropFilter: "blur(1px)",
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
    </Box>
  );
};

export default PageBackgroundWrapper;
