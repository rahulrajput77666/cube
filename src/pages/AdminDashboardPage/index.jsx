import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Box,Button,Typography,Pagination } from "@mui/material";
import SearchBar from "../../components/SearchBar/SearchBar";
import SearchResultHeader from "../../components/SearchResultHeader/SearchResultHeader";
import SearchResultCard from "../../components/SearchResultCard/SearchResultCard";
import KnowledgePreviewDrawer from "../../components/KnowledgePreviewDrawer/KnowledgePreviewDrawer";
import { loadRepositoryItems } from "../../utils/permissionStorage";
function AdminDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [previewWidth, setPreviewWidth] = useState(450);
  const [page, setPage] = useState(1);

  const pageSize = 10;
  const repositoryItems = loadRepositoryItems();

  const filteredKnowledge = repositoryItems.filter((item) => {
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

  const handleSearchChange = (value) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const matches = repositoryItems.filter((item) =>
      [item.title, item.description, item.chip1, item.chip2, item.chip3, item.chip4]
        .join(" ")
        .toLowerCase()
        .includes(value.toLowerCase())
    );

    setSuggestions(matches.slice(0, 5));
    setPage(1);
  };

  const totalResults = filteredKnowledge.length;
  const totalPages = Math.ceil(totalResults / pageSize);

  const paginatedKnowledge = filteredKnowledge.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreview = (item) => {
    setSelectedDocument(item);
    setPreviewOpen(true);
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(suggestion.title);
    setSuggestions([]);
    setPage(1);
  };

  const handleSearch = () => {
    setSuggestions([]);
    setPage(1);
  };

  return (
    <AdminLayout>
      <Box sx={{ px: 5, pt: 4, pb: 5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Knowledge Repository
            </Typography>

            <Typography sx={{ mt: 1, color: "#667085" }}>
              Search, view and manage knowledge documents from the repository.
            </Typography>
          </Box>

          {/* Requests button intentionally omitted for admin dashboard */}
          <Box />
        </Box>

        <SearchBar searchTerm={searchTerm} setSearchTerm={handleSearchChange} suggestions={suggestions} onSuggestionSelect={handleSuggestionSelect} onSearch={handleSearch} />

        <SearchResultHeader count={filteredKnowledge.length} />

        {filteredKnowledge.length === 0 ? (
          <Typography sx={{ mt: 4, textAlign: "center", color: "#667085" }}>No documents found.</Typography>
        ) : (
          <>
            {paginatedKnowledge.map((item) => (
              <SearchResultCard key={item.id} item={item} onPreview={handlePreview} />
            ))}

            <Box sx={{ mt: 5, pt: 3, borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
              <Typography sx={{ color: "#667085", fontWeight: 500 }}>
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalResults)} of {totalResults} results
              </Typography>

              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" shape="rounded" size="large" />
            </Box>
          </>
        )}
      </Box>

      <KnowledgePreviewDrawer open={previewOpen} selectedDocument={selectedDocument} onClose={() => setPreviewOpen(false)} previewWidth={previewWidth} setPreviewWidth={setPreviewWidth} />
    </AdminLayout>
  );
}

export default AdminDashboardPage;