import { AppBar, Toolbar, Typography, Avatar, Box } from "@mui/material";

const Header = () => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        borderBottom: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 96,
          px: { xs: 2, md: 4 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ width: 80, height: 80, borderRadius: 2, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.png" alt="CUBE" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={700} color="#111827">
              CUBE
            </Typography>
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              Knowledge repository
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            backgroundColor: "#F8FAFC",
            borderRadius: 4,
            px: 2,
            py: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              color: "#374151",
            }}
          >
            Rahul Singh
          </Typography>

          <Avatar
            sx={{
              width: 40,
              height: 40,
              fontSize: 14,
              fontWeight: 600,
              bgcolor: "#2563EB",
            }}
          >
            RS
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;