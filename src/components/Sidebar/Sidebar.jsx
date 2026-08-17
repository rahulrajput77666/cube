import { useState } from "react";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  const role =
    (typeof window !== "undefined" &&
      (localStorage.getItem("userRole") || localStorage.getItem("role"))) ||
    "EMPLOYEE";

  const dmsPath = role.toUpperCase() === "MANAGER" ? "/admin" : "/search";

  const menuItems = [
    { label: "SMS", icon: <SmsOutlinedIcon />, path: "/sms" },
    { label: "DMS", icon: <FolderOutlinedIcon />, path: dmsPath },
    { label: "Project Planning", icon: <CalendarMonthOutlinedIcon />, path: "/project-planning" },
    { label: "Issue Tracking", icon: <BugReportOutlinedIcon />, path: "/issue-tracking" },
    { label: "Review", icon: <RateReviewOutlinedIcon />, path: "/review" },
    { label: "Knowledge Repository", icon: <MenuBookOutlinedIcon />, path: "/search" },
  ];

  const handleNavigation = (path) => {
    setActivePath(path);
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: 260,
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #E5E7EB",
        boxShadow: "0 0 24px rgba(15, 23, 42, 0.04)",
        px: 2,
        pt: 3,
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <Box
        sx={{
          mb: 4,
          px: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          ☰ Menu
        </Typography>
      </Box>

      <List>
        {menuItems.map((item) => {
          const isActive = activePath === item.path;

          return (
            <ListItemButton
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mb: 1,
                borderRadius: 2,
                bgcolor: isActive ? "#EFF6FF" : "transparent",
                color: isActive ? "#1D4ED8" : "#111827",
                transition: "background-color 0.2s ease, color 0.2s ease",
                '&:hover': {
                  bgcolor: "#F8FAFC",
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
                primaryTypographyProps={{
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
