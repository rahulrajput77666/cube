import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Box,Tabs,Tab,Card,Typography,Chip,Stack,Button,Divider,TextField,Paper,IconButton,} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import mockReviewRequests from "../../mocks/mockReviewRequests";
import {
  addApprovedEmployeeSubmission,
  loadPermissionRequests,
  savePermissionRequests,
} from "../../utils/permissionStorage";

const normalizeStatus = (value) => String(value || "").toUpperCase();
const getSafeKeys = (item) => (Array.isArray(item?.keys) ? item.keys : []);
const getSafeAttachments = (item) =>
  Array.isArray(item?.attachments) ? item.attachments : [];

function GrantPermissionPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [editingDescription, setEditingDescription] = useState(null);
  const [editingKeys, setEditingKeys] = useState(null);

  useEffect(() => {
    const role = (localStorage.getItem("role") || "").toUpperCase();
    if (role !== "MANAGER" && role !== "ADMIN") {
      navigate("/search");
    }
  }, [navigate]);

  const [requests, setRequests] = useState(() => {
    const stored = loadPermissionRequests();
    const base = stored && stored.length > 0 ? stored : mockReviewRequests;
    return base.map((item) => ({
      ...item,
      keys: getSafeKeys(item),
      attachments: getSafeAttachments(item),
      description: item?.description || item?.summary || "",
      status: normalizeStatus(item.status),
    }));
  });

  useEffect(() => {
    const pendingModifyDocument = localStorage.getItem("pendingModifyDocument");

    if (!pendingModifyDocument) {
      savePermissionRequests(requests);
      return;
    }

    try {
      const parsed = JSON.parse(pendingModifyDocument);
      const hasMatch = requests.some((item) => item.id === parsed?.id);

      if (parsed && !hasMatch) {
        const normalizedItem = {
          ...parsed,
          keys: getSafeKeys(parsed),
          attachments: getSafeAttachments(parsed),
          status: normalizeStatus(parsed.status || "APPROVED"),
        };

        setRequests((prev) => [normalizedItem, ...prev]);
      }

      setTab(1);
      localStorage.removeItem("pendingModifyDocument");
    } catch (error) {
      // ignore invalid JSON
    }

    savePermissionRequests(requests);
  }, [requests]);

  const handleApprove = (id) => {
    const selected = requests.find((item) => item.id === id);

    if (!selected) return;

    const updatedRequests = requests.map((item) =>
      item.id === id
        ? {
            ...item,
            status: "APPROVED",
          }
        : item
    );

    savePermissionRequests(updatedRequests);
    setRequests(updatedRequests);
    addApprovedEmployeeSubmission({
      ...selected,
      status: "APPROVED",
    });
  };

  const handleReject = (id) => {
    const updated = requests.map((item) =>
      item.id === id
        ? {
            ...item,
            status: "REJECTED",
          }
        : item
    );

    savePermissionRequests(updated);
    setRequests(updated);
  };

  const filteredData = useMemo(
    () =>
      requests.filter((item) => {
        const status = normalizeStatus(item.status);

        if (tab === 0) return status === "PENDING";
        if (tab === 1) return status === "APPROVED";
        return status === "REJECTED";
      }),
    [requests, tab]
  );

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#F8FAFC",
        minHeight: "100vh",
      }}
    >
      {/* Header */}

      <Box
        sx={{
          mb: 4,
          textAlign: "center",
          px: 2,
          py: 4,
          borderRadius: 3,
          backgroundColor: "#ffffff",
          boxShadow:
            "0 10px 30px rgba(15, 23, 42, 0.05)",
          border: "1px solid #E5E7EB",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Knowledge Review Queue
        </Typography>

        <Typography
          sx={{
            color: "#667085",
            mt: 1,
          }}
        >
          Review employee submissions
          before publishing them to the
          knowledge repository.
        </Typography>
      </Box>

      {/* Tabs */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, value) =>
            setTab(value)
          }
        >
          <Tab label="Pending Review" />
          <Tab label="Approved" />
          <Tab label="Rejected" />
        </Tabs>
      </Card>

      {/* Records */}

      <Stack spacing={3}>
        {filteredData.map((item) => (
          <Card
            key={item.id}
            sx={{
              p: 4,
              borderRadius: 3,
            }}
          >
            {/* Employee */}

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "flex-start",
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {item.employeeName}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Submitted On :
                  {" "}
                  {item.submittedOn}
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={600}
                  mt={2}
                >
                  {item.title}
                </Typography>
              </Box>

              <Chip
                label={normalizeStatus(item.status)}
                color={
                  normalizeStatus(item.status) ===
                  "APPROVED"
                    ? "success"
                    : normalizeStatus(item.status) ===
                      "REJECTED"
                    ? "error"
                    : "warning"
                }
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Keys */}

           <Box sx={{ mb: 4 }}>
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      mb: 2,
    }}
  >
    <Typography
      variant="subtitle1"
      fontWeight={700}
    >
      Keywords
    </Typography>

    {editingKeys === item.id ? (
      <Button
        size="small"
        variant="contained"
        onClick={() =>
          setEditingKeys(null)
        }
      >
        OK
      </Button>
    ) : (
      <IconButton
        onClick={() =>
          setEditingKeys(item.id)
        }
      >
        <EditIcon />
      </IconButton>
    )}
  </Box>

  {editingKeys === item.id ? (
    <TextField
      fullWidth
      value={getSafeKeys(item).join(", ")}
      onChange={(e) => {
        const updated =
          requests.map((request) =>
            request.id === item.id
              ? {
                  ...request,
                  keys:
                    e.target.value
                      .split(",")
                      .map((key) => key.trim())
                      .filter(Boolean),
                }
              : request
          );

        setRequests(updated);
      }}
    />
  ) : (
    <Stack
      direction="row"
      spacing={1}
      flexWrap="wrap"
    >
      {getSafeKeys(item).map((key) => (
        <Chip
          key={key}
          label={key}
          sx={{ mb: 1 }}
        />
      ))}
    </Stack>
  )}
</Box>

            {/* Description */}

           <Box sx={{ mb: 4 }}>
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      mb: 2,
    }}
  >
    <Typography
      variant="subtitle1"
      fontWeight={700}
    >
      Description
    </Typography>

    {editingDescription === item.id ? (
      <Button
        size="small"
        variant="contained"
        onClick={() =>
          setEditingDescription(null)
        }
      >
        OK
      </Button>
    ) : (
      <IconButton
        onClick={() =>
          setEditingDescription(item.id)
        }
      >
        <EditIcon />
      </IconButton>
    )}
  </Box>

  <TextField
    fullWidth
    multiline
    minRows={8}
    value={item.description}
    disabled={
      editingDescription !== item.id
    }
    onChange={(e) => {
      const updated =
        requests.map((request) =>
          request.id === item.id
            ? {
                ...request,
                description:
                  e.target.value,
              }
            : request
        );

      setRequests(updated);
    }}
  />
</Box>
            {/* Attachments */}

            <Typography
              variant="subtitle1"
              fontWeight={700}
              mb={2}
            >
              Attachments
            </Typography>

            <Stack spacing={2}>
              {getSafeAttachments(item).map((file) => (
                <Paper
                  key={file.id || `${file.name}-${file.size}`}
                  variant="outlined"
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography fontWeight={600}>{file.name}</Typography>

                    <Typography variant="body2" color="text.secondary">
                      {file.size}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1}>
                    <Button
                      startIcon={<VisibilityIcon />}
                      onClick={() => {
                        const fileUrl = file?.previewUrl || file?.fileUrl || file?.downloadUrl;
                        if (fileUrl) {
                          window.open(fileUrl, "_blank", "noopener,noreferrer");
                          return;
                        }

                        alert("No preview available for this file.");
                      }}
                    >
                      Preview
                    </Button>

                    <Button
                      startIcon={<DownloadIcon />}
                      onClick={() => {
                        const href = file?.fileUrl || file?.downloadUrl || file?.previewUrl || "";

                        if (!href) {
                          alert("No downloadable file is available for this attachment.");
                          return;
                        }

                        const link = document.createElement("a");
                        link.href = href;
                        link.download = file.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Download
                    </Button>

                    <Button
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => alert("Only the manager who uploaded or approved this document can delete it.")}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>

            {/* Actions */}

            {normalizeStatus(item.status) === "PENDING" && (
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={
                    <CancelIcon />
                  }
                  onClick={() =>
                    handleReject(
                      item.id
                    )
                  }
                >
                  Reject
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  startIcon={
                    <CheckCircleIcon />
                  }
                  onClick={() =>
                    handleApprove(
                      item.id
                    )
                  }
                >
                  Approve & Upload
                </Button>
              </Box>
            )}
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export default GrantPermissionPage;