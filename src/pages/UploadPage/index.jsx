import { useRef, useState } from "react";
import {Box,Card,Typography,Button,TextField,Chip,IconButton,Stack,Divider,Paper,} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function UploadPage() {
  const [keys, setKeys] = useState(["oracle", "weblogic", "flexcube", "hooks"]);
  const [keyInput, setKeyInput] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
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
    const selectedFiles = Array.from(event.target.files);
    const nextFiles = selectedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      size: file.size,
      type: file.type,
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ keys, description, files });
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
        <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
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
            <Typography sx={{ color: "#667085", maxWidth: 720, mx: "auto" }}>
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
                    Keys (separate with spaces)
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#667085", mb: 2 }}>
                    Add keywords that best describe your solution. Press Enter or click + to add more.
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {keys.map((key) => (
                      <Chip key={key} label={key} onDelete={() => handleKeyDelete(key)} />
                    ))}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
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

                  <input ref={fileInputRef} type="file" multiple onChange={handleFilesChange} hidden />

                  <Stack spacing={2} mt={3}>
                    {files.map((file) => (
                      <Paper
                        key={file.id}
                        variant="outlined"
                        sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}
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
                  <Button type="submit" variant="contained" size="large">
                    Submit
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
