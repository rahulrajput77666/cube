import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Tabs, Tab, Typography, Stack, Card } from "@mui/material";
import AdminLayout from "../../layouts/AdminLayout";
import GrantPermissionPage from "../GrantPermissionPage";
import UploadPage from "../UploadPage";
import { loadUploadedSolutions, loadPermissionRequests } from "../../utils/permissionStorage";
import SearchResultCard from "../../components/SearchResultCard/SearchResultCard";

function MyUploadsView() {
  const [items, setItems] = useState([]);
  const username = localStorage.getItem("username") || "";

  const load = () => {
    const uploaded = loadUploadedSolutions() || [];
    const requests = loadPermissionRequests() || [];
    const norm = (v) => String(v || "").toLowerCase().trim();

    const managerUploads = uploaded
      .filter((item) => norm(item.uploadedBy).includes(norm(username)))
      .map((i) => ({ ...i, roleBadge: "Manager" }));

    const employeeUploadsByManager = requests
      .filter((r) => norm(r.employeeName).includes(norm(username)))
      .map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description || r.summary || "",
        uploadedBy: r.employeeName,
        date: r.submittedOn,
        attachments: r.attachments || [],
        chip1: (r.keys || [])[0] || "",
        chip2: (r.keys || [])[1] || "",
        chip3: (r.keys || [])[2] || "",
        chip4: (r.keys || [])[3] || "",
        roleBadge: "Employee",
      }));

    const combined = [...managerUploads, ...employeeUploadsByManager];
    // sort by date desc when possible
    combined.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    setItems(combined);
  };

  useEffect(() => {
    load();

    const onRepositoryUpdated = () => load();
    const onPermissionRequestsUpdated = () => load();

    window.addEventListener("repositoryUpdated", onRepositoryUpdated);
    window.addEventListener("permissionRequestsUpdated", onPermissionRequestsUpdated);

    return () => {
      window.removeEventListener("repositoryUpdated", onRepositoryUpdated);
      window.removeEventListener("permissionRequestsUpdated", onPermissionRequestsUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!items.length) {
    return (
      <Typography sx={{ mt: 4, color: "#667085" }}>No uploads found.</Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {items.map((item) => (
        <Card key={item.id} sx={{ p: 2, position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
            <Typography variant="caption" sx={{ bgcolor: '#E6F0FF', px: 1.5, py: 0.5, borderRadius: 1, fontWeight: 700 }}>
              {item.roleBadge}
            </Typography>
          </Box>
          <SearchResultCard item={item} onPreview={() => {}} onDelete={() => {}} />
        </Card>
      ))}
    </Stack>
  );
}

function KnowledgeManagementPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "upload" ? 1 : searchParams.get("tab") === "myuploads" ? 2 : 0;
  const [tab, setTab] = useState(initialTab);
  useEffect(() => {
    // ensure only managers and admins access
    const role = (localStorage.getItem("role") || "").toUpperCase();
    if (role !== "MANAGER" && role !== "ADMIN") {
      // non-authorized roles will be redirected by individual pages
    }
  }, []);

  useEffect(() => {
    // respond to query param changes for tab
    const qp = searchParams.get("tab");
    if (qp === "upload") setTab(1);
    else if (qp === "myuploads") setTab(2);
    else setTab(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  return (
    <AdminLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
          Knowledge Management
        </Typography>

        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
            <Tab label="Grant Permission" />
            <Tab label="Upload Solutions" />
            <Tab label="My Uploads" />
          </Tabs>

          <Box>
            {tab === 0 && <GrantPermissionPage />}
            {tab === 1 && <UploadPage />}
            {tab === 2 && <MyUploadsView />}
          </Box>
        </Card>
      </Box>
    </AdminLayout>
  );
}

export default KnowledgeManagementPage;
