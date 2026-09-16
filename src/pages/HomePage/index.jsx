import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";

const getDisplayUser = (username, role) => {
  const normalizedRole = String(role || "EMPLOYEE").toUpperCase();
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

const HomePage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const role =
    (typeof window !== "undefined" &&
      (localStorage.getItem("userRole") || localStorage.getItem("role"))) ||
    "EMPLOYEE";

  const username =
    (typeof window !== "undefined" && localStorage.getItem("username")) || "User";

  const user = getDisplayUser(username, role);
  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";

  const dmsPath = role.toUpperCase() === "MANAGER" ? "/admin" : "/search";

  const menuItems = [
    {
      label: "SMS",
      icon: <SmsOutlinedIcon />,
      path: "/sms",
    },
    {
      label: "DMS",
      icon: <FolderOutlinedIcon />,
      path: dmsPath,
    },
    {
      label: "Project Planning",
      icon: <CalendarMonthOutlinedIcon />,
      path: "/project-planning",
    },
    {
      label: "Issue Tracking",
      icon: <BugReportOutlinedIcon />,
      path: "/issue-tracking",
    },
    {
      label: "Review",
      icon: <RateReviewOutlinedIcon />,
      path: "/review",
    },
  ];

  const handleMenuClick = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <AppBar
        position="fixed"
        elevation={0}
        color="inherit"
        sx={{ borderBottom: "1px solid #E5E7EB" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ border: "1px solid #E5E7EB" }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 80, height: 80, borderRadius: 2, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={`${import.meta.env.BASE_URL}logo.png`} alt="CUBE" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
              </Box>

              <Box>
                <Typography variant="h6" fontWeight={700} color="#111827">
                  CUBE
                </Typography>
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  Home dashboard
                </Typography>
              </Box>
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
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" sx={{ color: "#6B7280", display: "block" }}>
                {user.role}
              </Typography>
              <Typography variant="body1" fontWeight={700} color="#111827">
                {user.name}
              </Typography>
            </Box>

            <Avatar
              sx={{
                width: 40,
                height: 40,
                fontWeight: 700,
                bgcolor: "#2563EB",
              }}
            >
              {initials}
            </Avatar>

            <IconButton
              color="primary"
              sx={{
                border: "1px solid #E5E7EB",
                bgcolor: "#FFFFFF",
              }}
            >
              <NotificationsNoneOutlinedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            borderRadius: 0,
            borderRight: "1px solid #E5E7EB",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Modules
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <ListItemButton
                  key={item.label}
                  onClick={() => handleMenuClick(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    transition: "background-color 0.2s ease, color 0.2s ease",
                    bgcolor: isActive ? "#EFF6FF" : "transparent",
                    color: isActive ? "#1D4ED8" : "inherit",
                    '&:hover': {
                      bgcolor: "#EFF6FF",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? "#1D4ED8" : "#4B5563",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>

      <Box sx={{ pt: "96px", px: 4, pb: 4 }}>
        <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="h4" fontWeight={700}>
            Welcome to CUBE
          </Typography>
          <Typography sx={{ color: "#667085" }}>
            Open the menu to select a module.
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: 3,
            p: 4,
            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.08)",
          }}
        >
          
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
