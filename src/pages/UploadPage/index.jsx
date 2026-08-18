import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Box,Card,Typography,Button,TextField,Chip,IconButton,Stack,Divider,Paper,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  createKnowledge,
  getKnowledgeIdFromResponse,
  mapKnowledgeApiResponseToRepositoryItem,
  uploadKnowledgeFiles,
} from "../../api/knowledgeApi";
import {
  appendPermissionRequest,
  saveRepositoryItem,
} from "../../utils/permissionStorage";

function UploadPage({ reviewMode = false }) {
  const navigate = useNavigate();
  const role = (localStorage.getItem("role") || "").toUpperCase();
  const username = localStorage.getItem("username") || "Unknown User";
  const isEmployee = role === "EMPLOYEE";
  const isManagerOrAdmin = role === "MANAGER" || role === "ADMIN";
  const shouldRequireApproval = !isManagerOrAdmin && reviewMode;

  const [keys, setKeys] = useState([]);
  const [keyInput, setKeyInput] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const handleAddKey = () => {
    const trimmed = keyInput.trim();
    if (trimmed && !keys.includes(trimmed)) {
      setKeys((prev) => [...prev, trimmed]);
      setKeyInput("");
    }
  };

  const handleKeyDelete = (keyToDelete) => {
    setKeys((prev) => prev.filter((item) => item !== keyToDelete));
  };

  const handleKeyInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddKey();
    }
  };

  const handleFilesChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const nextFiles = selectedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file,
    }));

    setFiles((prev) => [...prev, ...nextFiles]);
    event.target.value = null;
  };

  const handleFileRemove = (fileId) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleAddFilesClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      alert("Please enter a solution title.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }

    if (!files.length) {
      alert("Please upload at least one file before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedKeys = [
        ...new Set(keys.filter(Boolean).map((key) => String(key).trim()).filter(Boolean)),
      ];

      if (!normalizedKeys.length) {
        alert("Please add at least one key before submitting the solution.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        keywords: normalizedKeys,
      };

      const response = await createKnowledge(payload);
      const knowledgeRecord = response?.knowledge || response;
      const knowledgeId = getKnowledgeIdFromResponse(response) || `${Date.now()}`;

      let uploadedAttachments = [];
      try {
        uploadedAttachments = await uploadKnowledgeFiles(knowledgeId, files);
      } catch (attachmentError) {
        console.warn("File upload skipped or failed on the backend contract:", attachmentError);
      }

      const mappedItem = mapKnowledgeApiResponseToRepositoryItem(response, {
        id: knowledgeId,
        title: title.trim(),
        description: description.trim(),
        uploadedBy: username,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        downloads: 0,
        source: reviewMode ? "employee" : "manager",
        status: reviewMode ? "PENDING" : "APPROVED",
        chip1: normalizedKeys[0] || "knowledge",
        chip2: normalizedKeys[1] || "repository",
        chip3: normalizedKeys[2] || "document",
        chip4: normalizedKeys[3] || "solution",
        keywords: normalizedKeys,
        keys: normalizedKeys,
      });

      const finalAttachments =
        uploadedAttachments.length > 0
          ? uploadedAttachments.map((file, index) => ({
              id: file.attachmentId || file.id || `${knowledgeId}-${index}`,
              attachmentId: file.attachmentId || file.id || null,
              name: file.fileName || file.name || `attachment-${index + 1}`,
              fileName: file.fileName || file.name || `attachment-${index + 1}`,
              size: file.fileSize || file.size || "0 KB",
              fileSize: file.fileSize || file.size || "0 KB",
            }))
          : files.map((fileEntry, index) => ({
              id: `${fileEntry.id || index}-${Date.now()}`,
              attachmentId: null,
              name: fileEntry.name,
              fileName: fileEntry.name,
              size: fileEntry.size
                ? `${Math.max(1, Math.round(fileEntry.size / 1024))} KB`
                : "0 KB",
              fileSize: fileEntry.size || 0,
            }));

      mappedItem.attachments = finalAttachments;
      mappedItem.keywords = normalizedKeys;
      mappedItem.keys = normalizedKeys;
      mappedItem.tags = normalizedKeys;
      mappedItem.chip1 = normalizedKeys[0] || "";
      mappedItem.chip2 = normalizedKeys[1] || "";
      mappedItem.chip3 = normalizedKeys[2] || "";
      mappedItem.chip4 = normalizedKeys[3] || "";

      if (shouldRequireApproval) {
        const request = {
          id: `request-${knowledgeId || Date.now()}-${Math.random().toString(16).slice(2)}`,
          employeeName: username,
          submittedOn: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: "PENDING",
          title: title.trim(),
          keys: [...normalizedKeys],
          description: description.trim(),
          attachments: finalAttachments,
        };

        appendPermissionRequest(request);
        alert("Solution submitted for manager review successfully.");
        navigate("/grant-permission");
      } else {
        saveRepositoryItem(mappedItem);
        alert("Solution published successfully.");
      }

      console.log("Knowledge submission response:", knowledgeRecord);
      setTitle("");
      setDescription("");
      setKeyInput("");
      setFiles([]);
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to submit solution. Please try again.";

      alert(serverMessage);
      console.error("Knowledge submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        p: 5,
        backgroundColor: "#F8FAFC",
        minHeight: "calc(100vh - 84px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
        }}
      >
        <Box
          sx={{
            mb: 4,
            textAlign: "center",
            px: 2,
            py: 4,
            borderRadius: 3,
            backgroundColor: "#ffffff",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
            border: "1px solid #E5E7EB",
          }}
        >
          <Typography variant="h4" fontWeight={700} mb={1}>
            Upload Solution
          </Typography>

          <Typography
            sx={{
              color: "#667085",
              maxWidth: 720,
              mx: "auto",
            }}
          >
            Upload knowledge documents, implementation guides, PDFs, configurations and solution documents to the repository.
          </Typography>
        </Box>

        <Card
          sx={{
            p: 5,
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
            border: "1px solid #E2E8F0",
            width: "100%",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={5}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Solution title
                </Typography>

                <TextField
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Enter solution title"
                  fullWidth
                  sx={{ mb: 3 }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Keys (separate with spaces)
                </Typography>

                <Typography variant="body2" sx={{ color: "#667085", mb: 2 }}>
                  Add keywords that best describe your solution.
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {keys.map((key) => (
                    <Chip key={key} label={key} onDelete={() => handleKeyDelete(key)} />
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    value={keyInput}
                    onChange={(event) => setKeyInput(event.target.value)}
                    onKeyDown={handleKeyInputKeyDown}
                    placeholder="Add another key"
                    size="small"
                    fullWidth
                  />

                  <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddKey}>
                    Add
                  </Button>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Description (including code)
                </Typography>

                <TextField
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Write a short description of the solution..."
                  multiline
                  minRows={8}
                  fullWidth
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Attach documents
                </Typography>

                <Typography variant="body2" sx={{ color: "#667085", mb: 3 }}>
                  Docs, PDF, TXT, JSON, all files are accepted.
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 4,
                    borderStyle: "dashed",
                    borderColor: "#CBD5E1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <UploadFileIcon sx={{ fontSize: 36, color: "#2563EB" }} />

                    <Box>
                      <Typography fontWeight={600}>Click to upload or drag and drop</Typography>
                      <Typography variant="body2" sx={{ color: "#667085" }}>
                        Attach documents for your solution.
                      </Typography>
                    </Box>
                  </Box>

                  <Button variant="contained" onClick={handleAddFilesClick}>
                    Add more files
                  </Button>
                </Paper>

                <input ref={fileInputRef} type="file" multiple hidden onChange={handleFilesChange} />

                <Stack spacing={2} mt={3}>
                  {files.map((file) => (
                    <Paper
                      key={file.id}
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
                        <Typography variant="body2" sx={{ color: "#667085" }}>
                          {Math.round(file.size / 1024)} KB
                        </Typography>
                      </Box>

                      <IconButton onClick={() => handleFileRemove(file.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Paper>
                  ))}
                </Stack>
              </Box>

              <Divider />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Submitting..."
                    : shouldRequireApproval
                      ? "Submit For Review"
                      : "Submit"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default UploadPage;