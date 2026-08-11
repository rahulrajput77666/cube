import { useState } from "react";
import {Box,Tabs,Tab,Card,Typography,Chip,Stack,Button,Divider,TextField,Paper,IconButton,} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import mockReviewRequests from "../../mocks/mockReviewRequests";

function GrantPermissionPage() {
  const [tab, setTab] = useState(0);
  const [editingDescription, setEditingDescription] =
  useState(null);
  const [editingKeys, setEditingKeys] =
  useState(null);

  const [requests, setRequests] =
    useState(mockReviewRequests);

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "APPROVED",
            }
          : item
      )
    );
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "REJECTED",
            }
          : item
      )
    );
  };

  const filteredData = requests.filter(
    (item) => {
      if (tab === 0)
        return item.status === "PENDING";

      if (tab === 1)
        return item.status === "APPROVED";

      return item.status === "REJECTED";
    }
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
                label={item.status}
                color={
                  item.status ===
                  "APPROVED"
                    ? "success"
                    : item.status ===
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
      value={item.keys.join(", ")}
      onChange={(e) => {
        const updated =
          requests.map((request) =>
            request.id === item.id
              ? {
                  ...request,
                  keys:
                    e.target.value
                      .split(",")
                      .map((key) =>
                        key.trim()
                      ),
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
      {item.keys.map((key) => (
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
              {item.attachments.map(
                (file) => (
                  <Paper
                    key={file.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >
                    <Box>
                      <Typography
                        fontWeight={600}
                      >
                        {file.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {file.size}
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      spacing={1}
                    >
                      <Button
                        startIcon={
                          <VisibilityIcon />
                        }
                      >
                        Preview
                      </Button>

                      <Button
                        startIcon={
                          <DownloadIcon />
                        }
                      >
                        Download
                      </Button>

                      <Button
                        color="error"
                        startIcon={
                          <DeleteIcon />
                        }
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Paper>
                )
              )}
            </Stack>

            {/* Actions */}

            {item.status ===
              "PENDING" && (
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