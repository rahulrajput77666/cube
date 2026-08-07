import { Box, Typography } from "@mui/material";
import MainLayout from "../../layouts/MainLayout";
import PageBackgroundWrapper from "../../components/PageBackgroundWrapper";

const ProjectPlanningPage = () => {
  return (
    <PageBackgroundWrapper>
      <MainLayout backgroundColor="transparent">
        <Box sx={{ px: 5, pt: 4, pb: 5 }}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Project Planning
        </Typography>
        <Typography sx={{ color: '#667085' }}>
          Module placeholder — Project Planning
        </Typography>
        </Box>
      </MainLayout>
    </PageBackgroundWrapper>
  );
};

export default ProjectPlanningPage;
