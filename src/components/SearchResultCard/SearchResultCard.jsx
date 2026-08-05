import {Box,Card,Typography,Chip,Button,Divider,Menu,MenuItem,} from "@mui/material";
import { useState } from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function SearchResultCard({ item, onPreview }) {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    event?.stopPropagation();
    setAnchorEl(null);
  };

  const handleDownloadFile = (file) => {
    if (file.fileUrl) {
      const link = document.createElement("a");

      link.href = file.fileUrl;
      link.download = file.name;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    handleMenuClose();
  };

  const handleModify = () => {
    console.log("Modify:", item.id);
    handleMenuClose();
  };

  const handleDelete = () => {
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

          {item.attachments.map((file) => (
            <Box
              key={file.id}
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
                handleDownloadFile(item.attachments[0]);
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

              item.attachments.forEach((file) => {
                if (file.fileUrl) {
                  const link =
                    document.createElement("a");

                  link.href = file.fileUrl;
                  link.download = file.name;

                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
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