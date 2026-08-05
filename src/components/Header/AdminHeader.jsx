import { AppBar, Toolbar, Button, Box, Typography, Avatar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navButtonStyles = (path) => ({
    color: currentPath === path ? "#1D4ED8" : "#4B5563",
    textTransform: "none",
    px: 2,
    fontWeight: 600,
    bgcolor: currentPath === path ? "#EFF6FF" : "transparent",
    borderRadius: 4,
    '&:hover': {
      bgcolor: currentPath === path ? "#DBEAFE" : "#F8FAFC",
    },
  });

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
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
              Admin portal
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            backgroundColor: "#F8FAFC",
            borderRadius: 999,
            px: 1,
            py: 0.5,
          }}
        >
          <Button onClick={() => navigate("/admin")} sx={navButtonStyles("/admin")}>Discover & Read</Button>
          <Button onClick={() => navigate("/grant-permission")} sx={navButtonStyles("/grant-permission")}>Grant Permission</Button>
          <Button onClick={() => navigate("/upload")} sx={navButtonStyles("/upload")}>Upload Solution</Button>
          <Button onClick={() => navigate("/users")} sx={navButtonStyles("/users")}>Users</Button>
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
          <Avatar sx={{ bgcolor: "#2563EB", width: 40, height: 40, fontWeight: 700 }}>AS</Avatar>
          <Box>
            <Typography variant="body1" fontWeight={700} color="#111827">
              Rahul Singh
            </Typography>
            <Typography variant="caption" sx={{ color: "#6B7280" }}>
              Administrator
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AdminHeader;
