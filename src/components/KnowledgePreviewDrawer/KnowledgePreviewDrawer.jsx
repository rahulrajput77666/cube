import {Drawer,Box,Typography,Divider,Chip,IconButton,Button,} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { downloadAttachment } from "../../api/knowledgeApi";

/*
=========================================================
KNOWLEDGE PREVIEW DRAWER

CURRENT:
- Opens selected document details
- Shows attachments
- Opens files using previewUrl
- Downloads files using fileUrl
- Shows description, tags and metadata
- Resizable drawer

FUTURE BACKEND INTEGRATION

Document Details API

GET /knowledge/{documentId}

Response:

{
  "id": 1,
  "title": "WebLogic Guide",
  "description": "...",
  "fullDescription": "...",
  "uploadedBy": "admin",
  "uploadedDate": "2025-05-12",
  "downloadCount": 256,
  "tags": [],
  "attachments": []
}

=========================================================
*/

function KnowledgePreviewDrawer({
  open,
  selectedDocument,
  onClose,
  previewWidth,
  setPreviewWidth,
}) {
  if (!selectedDocument) return null;

  /* =====================================================
     RESIZE DRAWER

     CURRENT:
     Width stored in frontend state.

     FUTURE:
     Optional user preference storage.

     Example:

     localStorage.setItem(
       "drawerWidth",
       previewWidth
     );

  ===================================================== */

  const handleResize = (e) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = previewWidth;

    const onMouseMove = (event) => {
      const newWidth =
        startWidth +
        (startX - event.clientX);

      const clampedWidth = Math.max(
        350,
        Math.min(
          newWidth,
          window.innerWidth * 0.8
        )
      );

      setPreviewWidth(clampedWidth);
    };

    const onMouseUp = () => {
      window.removeEventListener(
        "mousemove",
        onMouseMove
      );

      window.removeEventListener(
        "mouseup",
        onMouseUp
      );
    };

    window.addEventListener(
      "mousemove",
      onMouseMove
    );

    window.addEventListener(
      "mouseup",
      onMouseUp
    );
  };

  /* =====================================================
     TODO BACKEND

     CURRENT:
     Opens previewUrl.

     FUTURE:

     GET /knowledge/file/{fileId}/preview

     Response

     {
       "previewUrl":
       "https://server/file.pdf"
     }

  ===================================================== */

  const handleOpenFile = async (file) => {
    const attachmentId = file?.attachmentId;

    if (attachmentId) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://192.168.0.104:8080/cube"}/api/v1/attachments/${attachmentId}/download`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}`, Accept: "application/octet-stream" } }
        );

        if (response.ok) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          window.open(objectUrl, "_blank", "noopener,noreferrer");
          return;
        }
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

  /* =====================================================
     TODO BACKEND

     CURRENT:
     Downloads file using fileUrl.

     FUTURE:

     GET /knowledge/file/{fileId}/download

     Response:
     Binary Stream

     OR

     {
       "downloadUrl":
       "https://server/file.pdf"
     }

  ===================================================== */

  const handleDownloadFile = async (file) => {
    const attachmentId = file?.attachmentId;

    if (attachmentId) {
      try {
        await downloadAttachment(attachmentId, file?.fileName || file?.name || "attachment");
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
      return;
    }

    alert("No downloadable attachment is available for this file.");
  };

  const tags = (
    Array.isArray(selectedDocument?.keywords)
      ? selectedDocument.keywords
      : Array.isArray(selectedDocument?.keys)
        ? selectedDocument.keys
        : Array.isArray(selectedDocument?.tags)
          ? selectedDocument.tags
          : []
  ).filter(Boolean);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: `${previewWidth}px`,
          minWidth: "350px",
          maxWidth: "80vw",
          position: "fixed",
          right: 0,
          left: "auto",
          top: 0,
          bottom: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transition:
            "width 0.05s linear",
        },
      }}
    >
      {/* Resize Handle */}

      <Box
        onMouseDown={handleResize}
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "8px",
          height: "100%",
          cursor: "col-resize",
          zIndex: 9999,

          "&:hover": {
            backgroundColor:
              "#2563EB",
          },
        }}
      />

      {/* =====================================================
          HEADER

          FUTURE:
          Could include:

          - Share Document
          - Favorite
          - Download All
          - Version History

      ===================================================== */}

      <Box
        sx={{
          p: 2,
          borderBottom:
            "1px solid #E5E7EB",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          flexShrink: 0,
          backgroundColor:
            "#FFFFFF",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          Document Preview
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 3,
        }}
      >
        {/* =====================================================
            DOCUMENT TITLE

            TODO BACKEND

            selectedDocument.title

        ===================================================== */}

        <Typography
          variant="h5"
          fontWeight={700}
          mb={3}
        >
          {selectedDocument.title}
        </Typography>

        {/* =====================================================
            ATTACHMENTS

            TODO BACKEND

            Expected API Response

            attachments: [
              {
                id: 1,
                name: "guide.pdf",
                size: "1.2 MB",
                previewUrl: "...",
                fileUrl: "..."
              }
            ]

        ===================================================== */}

        <Typography
          fontWeight={700}
          mb={2}
        >
          Attachments (
          {Array.isArray(selectedDocument?.attachments) ? selectedDocument.attachments.length : 0}
          )
        </Typography>

        <Divider />

        {(Array.isArray(selectedDocument?.attachments) ? selectedDocument.attachments : []).map(
          (file) => (
            <Box
              key={file.id}
              sx={{
                mt: 2,
                p: 2,
                border:
                  "1px solid #E5E7EB",
                borderRadius: 2,
                backgroundColor:
                  "#FFFFFF",

                "&:hover": {
                  backgroundColor:
                    "#F8FAFC",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    flex: 1,
                  }}
                >
                  <PictureAsPdfIcon color="error" />

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
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={
                      <OpenInNewIcon />
                    }
                    onClick={() =>
                      handleOpenFile(
                        file
                      )
                    }
                  >
                    Open
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    startIcon={
                      <DownloadIcon />
                    }
                    onClick={() =>
                      handleDownloadFile(
                        file
                      )
                    }
                  >
                    Download
                  </Button>
                </Box>
              </Box>
            </Box>
          )
        )}

        {/* =====================================================
            DESCRIPTION

            TODO BACKEND

            Replace with

            document.fullDescription

        ===================================================== */}

        <Typography
          fontWeight={700}
          sx={{
            mt: 4,
            mb: 2,
          }}
        >
          Description
        </Typography>

        <Box
          sx={{
            border:
              "1px solid #E5E7EB",
            borderRadius: 2,
            p: 2,
            height: 300,
            overflowY: "auto",
            backgroundColor:
              "#F8FAFC",
          }}
        >
          <Typography
            sx={{
              whiteSpace:
                "pre-wrap",
              lineHeight: 1.8,
            }}
          >
            {selectedDocument.fullDescription ||
              selectedDocument.description}
          </Typography>
        </Box>

        {/* =====================================================
            TAGS

            CURRENT:
            chip1-chip4

            FUTURE:

            tags: [
              "oracle",
              "weblogic"
            ]

            Render dynamically.

        ===================================================== */}

        <Typography
          fontWeight={700}
          sx={{
            mt: 4,
            mb: 2,
          }}
        >
          Keys
        </Typography>

        {tags.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {tags.map((tag) => (
              <Chip key={tag} label={tag} />
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">No keys available.</Typography>
        )}

        {/* =====================================================
            METADATA

            TODO BACKEND

            uploadedBy

            uploadedDate

            downloadCount

        ===================================================== */}

        <Box sx={{ mt: 4 }}>
  <Box
    sx={{
      display: "flex",
      mb: 2,
    }}
  >
    <Typography
      fontWeight={700}
      sx={{
        minWidth: 120,
      }}
    >
      Uploaded By :
    </Typography>

    <Typography color="text.secondary">
      {selectedDocument.uploadedBy}
    </Typography>
  </Box>

  <Box
    sx={{
      display: "flex",
      mb: 2,
    }}
  >
    <Typography
      fontWeight={700}
      sx={{
        minWidth: 120,
      }}
    >
      Upload Date :
    </Typography>

    <Typography color="text.secondary">
      {selectedDocument.date}
    </Typography>
  </Box>

  <Box
    sx={{
      display: "flex",
    }}
  >
    <Typography
      fontWeight={700}
      sx={{
        minWidth: 120,
      }}
    >
      Downloads :
    </Typography>

    <Typography color="text.secondary">
      {selectedDocument.downloads}
    </Typography>
  </Box>
</Box>

        {/* =====================================================
            FUTURE FEATURES

            - Share Document
            - Favorite Document
            - Document Rating
            - Version History
            - Audit Trail
            - Related Documents

            APIs

            POST /knowledge/favorite

            POST /knowledge/share

            GET /knowledge/{id}/versions

            GET /knowledge/{id}/related

        ===================================================== */}
      </Box>
    </Drawer>
  );
}

export default KnowledgePreviewDrawer;