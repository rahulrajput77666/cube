import {Box,Card,Typography,Chip,Button,Divider,Menu,MenuItem,} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { downloadAttachment } from "../../api/knowledgeApi";

function SearchResultCard({ item, onPreview }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isManager = (localStorage.getItem("role") || "").toUpperCase() === "MANAGER";

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    event?.stopPropagation();
    setAnchorEl(null);
  };

  const handleOpenFile = async (file) => {
    const attachmentId = file?.attachmentId;

    if (attachmentId) {
      try {
        const blob = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://192.168.0.19:8080/cube"}/api/v1/attachments/${attachmentId}/download`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}`, Accept: "application/octet-stream" } }
        ).then((response) => response.blob());

        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, "_blank", "noopener,noreferrer");
        return;
      } catch (error) {
        console.error("Preview failed:", error);
      }
    }

    const fallbackUrl = file?.previewUrl || file?.fileUrl || file?.downloadUrl;

    if (fallbackUrl) {
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      return;
    }

    alert("This attachment is not available for preview from the backend yet.");
  };

  const handleDownloadFile = async (file) => {
    const attachmentId = file?.attachmentId;

    if (attachmentId) {
      try {
        await downloadAttachment(attachmentId, file?.fileName || file?.name || item?.title || "attachment");
        handleMenuClose();
        return;
      } catch (error) {
        console.error("Authenticated download failed:", error);
      }
    }

    const href = file?.fileUrl || file?.downloadUrl || "";

    if (href) {
      const link = document.createElement("a");
      link.href = href;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      handleMenuClose();
      return;
    }

    alert("No downloadable attachment is available for this file.");
    handleMenuClose();
  };

  const handleModify = () => {
    if (!isManager) {
      alert("Only manager can able to modify");
      handleMenuClose();
      return;
    }

    localStorage.setItem("pendingModifyDocument", JSON.stringify(item));
    navigate("/grant-permission");
    handleMenuClose();
  };

  const handleDelete = () => {
    if (!isManager) {
      alert("Only manager can delete this document.");
      handleMenuClose();
      return;
    }

    console.log("Delete:", item.id);
    handleMenuClose();
  };

  return (
    <Card
      onClick={() => onPreview(item)}
      sx={{
        mt: 3,
        p: 3,
        borderRadius: 3,
        cursor: "pointer",
        transition: "all 0.2s ease",
        border: "1px solid #E5E7EB",

        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <PictureAsPdfIcon
              color="error"
              sx={{
                fontSize: 50,
              }}
            />

            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "#667085",
                }}
              >
                {item.description}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip label={item.chip1} />
            <Chip label={item.chip2} />
            <Chip label={item.chip3} />
            <Chip label={item.chip4} />
          </Box>

          <Typography
            sx={{
              mt: 2,
              color: "#667085",
            }}
          >
            Uploaded by {item.uploadedBy}
            {" • "}
            {item.date}
            {" • "}
            {item.downloads} downloads
          </Typography>
        </Box>

        <Box
          sx={{
            width: 340,
          }}
        >
          <Typography
            fontWeight={700}
            mb={2}
          >
            Attachments ({item.attachments.length})
          </Typography>

          <Divider />

          {(Array.isArray(item.attachments) ? item.attachments : []).map((file) => (
            <Box
              key={file.id || `${file.name}-${file.size}`}
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                    wordBreak: "break-word",
                  }}
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

              <Button
                variant="outlined"
                size="small"
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleMenuOpen}
              >
                View
              </Button>
            </Box>
          ))}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                const firstAttachment = Array.isArray(item.attachments) ? item.attachments[0] : null;
                if (firstAttachment) {
                  handleDownloadFile(firstAttachment);
                }
              }}
            >
              Download
            </MenuItem>

            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleModify();
              }}
            >
              Modify
            </MenuItem>

            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              Delete
            </MenuItem>
          </Menu>

          <Button
            fullWidth
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              mt: 3,
            }}
            onClick={(e) => {
              e.stopPropagation();

              (Array.isArray(item.attachments) ? item.attachments : []).forEach(async (file) => {
                const attachmentId = file?.attachmentId;
                if (attachmentId) {
                  try {
                    await downloadAttachment(attachmentId, file?.fileName || file?.name || "attachment");
                  } catch (error) {
                    console.error("Download all failed:", error);
                  }
                  return;
                }

                const href = file?.fileUrl || file?.downloadUrl || file?.previewUrl || "";

                if (!href) {
                  return;
                }

                const link = document.createElement("a");
                link.href = href;
                link.download = file.name;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              });
            }}
          >
            Download All
          </Button>
        </Box>
      </Box>
    </Card>
  );
}

export default SearchResultCard;