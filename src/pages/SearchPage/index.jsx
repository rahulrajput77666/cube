import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Box,Button,Typography,Pagination,Tabs,Tab,} from "@mui/material";
import MainLayout from "../../layouts/MainLayout";
import SearchBar from "../../components/SearchBar/SearchBar";
import SearchResultHeader from "../../components/SearchResultHeader/SearchResultHeader";
import SearchResultCard from "../../components/SearchResultCard/SearchResultCard";
import KnowledgePreviewDrawer from "../../components/KnowledgePreviewDrawer/KnowledgePreviewDrawer";
import { getKnowledge, mapKnowledgeApiResponseToRepositoryItem } from "../../api/knowledgeApi";
import {
  deletePermissionRequest,
  deleteRepositoryItem,
  loadRepositoryItems,
} from "../../utils/permissionStorage";
import { loadBookmarks } from "../../utils/bookmarkStorage";

function SearchPage() {
  const navigate = useNavigate();
  

  const [searchTerm, setSearchTerm] =
    useState("");

  const [suggestions, setSuggestions] =
    useState([]);

  const [previewOpen, setPreviewOpen] =
    useState(false);

  const [selectedDocument, setSelectedDocument] =
    useState(null);

  const [previewWidth, setPreviewWidth] =
    useState(450);

  const [page, setPage] = useState(1);
  const [repositoryItems, setRepositoryItems] = useState(() => loadRepositoryItems());
  const [tabIndex, setTabIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const syncRepository = async () => {
      try {
        const backendItems = await getKnowledge();
        if (!isMounted) return;

        const fallbackItems = loadRepositoryItems();
        const mappedItems = (Array.isArray(backendItems) ? backendItems : []).map((item) => {
          const mappedItem = mapKnowledgeApiResponseToRepositoryItem(item, {
            source: "backend",
          });
          const localItem = fallbackItems.find((candidate) => String(candidate.id) === String(mappedItem.id));

          if (!localItem) {
            return mappedItem;
          }

          const localAttachments = Array.isArray(localItem.attachments) ? localItem.attachments : [];
          const localById = new Map(
            localAttachments.map((attachment) => [
              String(attachment?.attachmentId || attachment?.id || attachment?.fileName || attachment?.name),
              attachment,
            ])
          );
          const attachments = (mappedItem.attachments || []).map((attachment) => {
            const localAttachment = localById.get(
              String(attachment?.attachmentId || attachment?.id || attachment?.fileName || attachment?.name)
            );

            return {
              ...(localAttachment || {}),
              ...attachment,
              fileUrl: attachment.fileUrl || localAttachment?.fileUrl || "",
              downloadUrl: attachment.downloadUrl || localAttachment?.downloadUrl || "",
              previewUrl: attachment.previewUrl || localAttachment?.previewUrl || "",
              githubUrl: attachment.githubUrl || localAttachment?.githubUrl || "",
              githubPath: attachment.githubPath || localAttachment?.githubPath || "",
              githubRepository: attachment.githubRepository || localAttachment?.githubRepository || "",
            };
          });

          return { ...mappedItem, attachments };
        });

        const mergedItems = [...mappedItems, ...fallbackItems.filter((localItem) => !mappedItems.some((apiItem) => apiItem.id === localItem.id))];
        setRepositoryItems(mergedItems);
      } catch (error) {
        if (isMounted) {
          setRepositoryItems(loadRepositoryItems());
        }
      }
    };

    syncRepository();

    const onRepositoryUpdated = () => {
      syncRepository();
    };

    try {
      const username = localStorage.getItem("username");
      const bm = loadBookmarks(username);
      setBookmarks(bm || []);
    } catch (e) {
      setBookmarks([]);
    }

    const onBookmarksUpdated = (e) => {
      try {
        const username = localStorage.getItem("username");
        const bm = loadBookmarks(username);
        setBookmarks(bm || []);
      } catch (err) {
        setBookmarks([]);
      }
    };

    window.addEventListener("bookmarksUpdated", onBookmarksUpdated);
    window.addEventListener("repositoryUpdated", onRepositoryUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener("bookmarksUpdated", onBookmarksUpdated);
      window.removeEventListener("repositoryUpdated", onRepositoryUpdated);
    };
  }, []);

  const handleTabChange = (e, value) => {
    setTabIndex(value);
    setPage(1);
  };

  const pageSize = 10;

  const filteredKnowledge =
    repositoryItems.filter((item) => {
      const search = searchTerm.toLowerCase();

      return (
        item.title
          .toLowerCase()
          .includes(search) ||
        item.description
          .toLowerCase()
          .includes(search) ||
        item.chip1
          .toLowerCase()
          .includes(search) ||
        item.chip2
          .toLowerCase()
          .includes(search) ||
        item.chip3
          .toLowerCase()
          .includes(search) ||
        item.chip4
          .toLowerCase()
          .includes(search)
      );
    });

  const handleSearchChange = (value) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const matches =
      repositoryItems.filter((item) =>
        [
          item.title,
          item.description,
          item.chip1,
          item.chip2,
          item.chip3,
          item.chip4,
        ]
          .join(" ")
          .toLowerCase()
          .includes(value.toLowerCase())
      );

    setSuggestions(matches.slice(0, 5));

    setPage(1);
  };

  const bookmarksToShow = bookmarks.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.chip1.toLowerCase().includes(search) ||
      item.chip2.toLowerCase().includes(search) ||
      item.chip3.toLowerCase().includes(search) ||
      item.chip4.toLowerCase().includes(search)
    );
  });

  const activeItems = tabIndex === 0 ? filteredKnowledge : bookmarksToShow;

  const totalResults = activeItems.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const paginatedKnowledge = activeItems.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (
    event,
    value
  ) => {
    setPage(value);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePreview = (item) => {
    setSelectedDocument(item);
    setPreviewOpen(true);
  };

  const handleSuggestionSelect = (
    suggestion
  ) => {
    setSearchTerm(suggestion.title);
    setSuggestions([]);
    setPage(1);
  };

  const handleDeleteItem = (deletedId) => {
    deleteRepositoryItem(deletedId);
    deletePermissionRequest(deletedId);

    setRepositoryItems((prev) => prev.filter((item) => String(item.id) !== String(deletedId)));
    setSelectedDocument((prev) =>
      prev && String(prev.id) === String(deletedId) ? null : prev
    );
    setPreviewOpen(false);
  };

  const handleSearch = () => {
    setSuggestions([]);
    setPage(1);
  };

 const handleRequestAccess = () => {
  navigate(
    "/employee-upload"
  );
};

  return (
    <MainLayout>
      <Box
        sx={{
          px: 5,
          pt: 4,
          pb: 5,
        }}
      >
        {/* Page Header */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
            >
              Knowledge Repository
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#667085",
              }}
            >
              Search, view and manage
              knowledge documents from
              the repository.
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#475569",
              }}
            >
            
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleRequestAccess}
            >
              Upload Solution
            </Button>

            
          </Box>
        </Box>

        {/* Search */}

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={
            handleSearchChange
          }
          suggestions={suggestions}
          onSuggestionSelect={
            handleSuggestionSelect
          }
          onSearch={handleSearch}
        />

        {/* Tab selector */}
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label={`All (${filteredKnowledge.length})`} />
          <Tab label={`Bookmarks (${bookmarks.length})`} />
        </Tabs>

        {/* Results Header */}

        <SearchResultHeader count={totalResults} />

        {/* Results */}

        {totalResults === 0 ? (
          <Typography
            sx={{
              mt: 4,
              textAlign: "center",
              color: "#667085",
            }}
          >
            No documents found.
          </Typography>
        ) : (
          <>
            {paginatedKnowledge.map(
              (item) => (
                <SearchResultCard
                  key={item.id}
                  item={item}
                  onPreview={handlePreview}
                  onDelete={handleDeleteItem}
                />
              )
            )}

            {/* Pagination */}

            <Box
              sx={{
                mt: 5,
                pt: 3,
                borderTop:
                  "1px solid #E5E7EB",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  color: "#667085",
                  fontWeight: 500,
                }}
              >
                Showing{" "}
                {(page - 1) *
                  pageSize +
                  1}
                {" to "}
                {Math.min(
                  page * pageSize,
                  totalResults
                )}
                {" of "}
                {totalResults}
                {" results"}
              </Typography>

              <Pagination
                count={totalPages}
                page={page}
                onChange={
                  handlePageChange
                }
                color="primary"
                shape="rounded"
                size="large"
              />
            </Box>
          </>
        )}
      </Box>

      {/* Preview Drawer */}

      <KnowledgePreviewDrawer
        open={previewOpen}
        selectedDocument={
          selectedDocument
        }
        onClose={() =>
          setPreviewOpen(false)
        }
        previewWidth={previewWidth}
        setPreviewWidth={
          setPreviewWidth
        }
      />
    </MainLayout>
  );
}

export default SearchPage;