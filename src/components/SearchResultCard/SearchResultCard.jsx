import {Box,Card,Typography,Chip,Button,Divider,Menu,MenuItem,IconButton,} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { isBookmarked, toggleBookmark } from "../../utils/bookmarkStorage";
import { downloadAttachment, deleteKnowledge, getAttachmentPreviewUrl } from "../../api/knowledgeApi";

function SearchResultCard({ item, onPreview, onDelete }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isManager = ["MANAGER", "ADMIN"].includes((localStorage.getItem("role") || "").toUpperCase());

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    event?.stopPropagation();
    setAnchorEl(null);
  };

  const attachments = Array.isArray(item?.attachments) ? item.attachments : [];

  const isBrowserPreviewable = (file) => {
    const contentType = String(file?.contentType || file?.mimeType || "").toLowerCase();
    const fileName = String(file?.fileName || file?.name || "").toLowerCase();
    return (
      contentType === "application/pdf" ||
      contentType.startsWith("image/") ||
      contentType.startsWith("text/") ||
      /\.(pdf|png|jpe?g|gif|webp|svg|txt|csv|json|xml|html?)$/.test(fileName)
    );
  };

  const handleOpenFile = async (file) => {
    const attachmentId = file?.attachmentId;
    if (!attachmentId) {
      alert("This attachment is not available for preview from the backend yet.");
      return;
    }

    if (!isBrowserPreviewable(file)) {
      await handleDownloadFile(file);
      return;
    }

    const previewWindow = window.open("", "_blank");

    try {
      const objectUrl = await getAttachmentPreviewUrl(file);
      if (previewWindow) {
        previewWindow.location.href = objectUrl;
      } else {
        window.open(objectUrl, "_blank", "noopener,noreferrer");
      }
      return;
    } catch (error) {
      previewWindow?.close();
      console.error("Preview failed:", error);
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
    navigate("/upload");
    handleMenuClose();
  };

  const username = localStorage.getItem("username");

  const [bookmarked, setBookmarked] = useState(() => isBookmarked(item?.id, username));

  const handleToggleBookmark = (e) => {
    e.stopPropagation();
    toggleBookmark(item, username);
    setBookmarked(isBookmarked(item?.id, username));
  };

  const [isDeleting, setIsDeleting] = useState(false);

const handleDelete = async () => {
  if (!isManager) {
    alert("Only manager can able to delete");
    handleMenuClose();
    return;
  }

  if (typeof onDelete !== "function") {
    alert("Delete isn't connected to the backend yet — this will be enabled once the delete endpoint is available.");
    handleMenuClose();
    return;
  }

  const confirmed = window.confirm(`Delete "${item.title}"? This can't be undone.`);
  if (!confirmed) {
    handleMenuClose();
    return;
  }

  handleMenuClose();
  setIsDeleting(true);

  try {
    // Only call the backend if this item actually has a real knowledge ID
    // (i.e. it came from the API, not a purely local entry).
    if (item?.id) {
      await deleteKnowledge(item.id);
    }
    onDelete(item.id);
  } catch (error) {
    console.error("Delete failed:", error);
    alert(error?.message || "Failed to delete. Please try again.");
  } finally {
    setIsDeleting(false);
  }
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

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                fontWeight={700}
              >
                {item.title}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {attachments.length > 0 ? (
                  attachments.map((file) => (
                    <Button
                      key={file.id || `${file.name}-${file.size}`}
                      variant="text"
                      size="small"
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        color: "#1D4ED8",
                        p: 0,
                        minWidth: 0,
                        fontWeight: 500,
                        display: "inline-flex",
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleOpenFile(file);
                      }}
                    >
                      {file.name || file.fileName || "Uploaded file"}
                    </Button>
                  ))
                ) : (
                  <Typography sx={{ color: "#667085" }}>No uploaded files</Typography>
                )}
              </Box>
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleToggleBookmark} aria-label="bookmark" size="large">
              {bookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
            </IconButton>
          </Box>
          <Typography
            fontWeight={700}
            mb={2}
          >
            Attachments ({attachments.length})
          </Typography>

          <Divider />

          {attachments.map((file) => (
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
                const firstAttachment = attachments[0] || null;
                if (firstAttachment) {
                  handleOpenFile(firstAttachment);
                }
              }}
            >
              Preview
            </MenuItem>

            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                const firstAttachment = attachments[0] || null;
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

              attachments.forEach(async (file) => {
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