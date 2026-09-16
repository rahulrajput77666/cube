import { AppBar, Toolbar, Button, Box, Typography, Avatar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const getDisplayUser = (username, role) => {
  const normalizedRole = String(role || "MANAGER").toUpperCase();
  const cleanUsername = String(username || "user")
    .replace(/[._-]+/g, " ")
    .trim();

  const words = cleanUsername.split(/\s+/).filter(Boolean);
  const roleWords = ["admin", "manager", "employee", "user"];
  const filteredWords = words.filter(
    (word) => !roleWords.includes(String(word).toLowerCase())
  );

  const displayName =
    filteredWords.length > 0
      ? filteredWords
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ")
      : "User";

  const userRole =
    normalizedRole === "ADMIN"
      ? "Admin"
      : normalizedRole === "MANAGER"
        ? "Manager"
        : "Employee";

  return { name: displayName, role: userRole };
};

function AdminHeader({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const storedUsername =
    (typeof window !== "undefined" && localStorage.getItem("username")) ||
    "User";
  const storedRole =
    (typeof window !== "undefined" && localStorage.getItem("role")) ||
    "MANAGER";

  const resolvedUser = user || getDisplayUser(storedUsername, storedRole);

  const initials = resolvedUser.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";

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
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="CUBE" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={700} color="#111827">
              CUBE
            </Typography>
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              {user.role} portal
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
          <Button onClick={() => navigate("/grant-permission")} sx={navButtonStyles("/grant-permission")}>Knowledge Management</Button>
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
          <Avatar sx={{ bgcolor: "#2563EB", width: 40, height: 40, fontWeight: 700 }}>{initials}</Avatar>
          <Box>
            <Typography variant="body1" fontWeight={700} color="#111827">
              {resolvedUser.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "#6B7280" }}>
              {resolvedUser.role}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AdminHeader;
