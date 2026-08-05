import { Box, Typography } from "@mui/material";
import MainLayout from "../../layouts/MainLayout";

const IssueTrackingPage = () => {
  return (
    <MainLayout>
      <Box sx={{ px: 5, pt: 4, pb: 5 }}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Issue Tracking
        </Typography>
        <Typography sx={{ color: '#667085' }}>
          Module placeholder — Issue Tracking
        </Typography>
      </Box>
    </MainLayout>
  );
};

export default IssueTrackingPage;
