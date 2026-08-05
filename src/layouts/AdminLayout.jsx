import { Box } from "@mui/material";
import AdminHeader from "../components/Header/AdminHeader";

function AdminLayout({ children }) {
  return (
    <>
      <AdminHeader />
      <Box sx={{ pt: "96px" }}>{children}</Box>
    </>
  );
}

export default AdminLayout;