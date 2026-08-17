import { Box } from "@mui/material";
import AdminHeader from "../components/Header/AdminHeader";

function AdminLayout({ children }) {
  const username =
    (typeof window !== "undefined" && localStorage.getItem("username")) ||
    "User";
  const role =
    (typeof window !== "undefined" && localStorage.getItem("role")) ||
    "MANAGER";

  const user = {
    name: String(username).replace(/[._-]+/g, " ").trim() || "User",
    role: String(role).toUpperCase() === "MANAGER" ? "Manager" : "Employee",
  };

  return (
    <>
      <AdminHeader user={user} />
      <Box sx={{ pt: "96px" }}>{children}</Box>
    </>
  );
}

export default AdminLayout;