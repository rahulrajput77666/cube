import UploadPage from "../UploadPage";
import EmployeeHeader from "../../components/Header/EmployeeHeader";
import { Box } from "@mui/material";

function EmployeeUploadPage() {
  return (
    <>
      <EmployeeHeader />
      <Box sx={{ pt: 12 }}>
        <UploadPage reviewMode={true} />
      </Box>
    </>
  );
}

export default EmployeeUploadPage;