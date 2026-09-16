import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { Box, Typography, Stack, Card } from "@mui/material";
import SearchResultCard from "../../components/SearchResultCard/SearchResultCard";
import { loadBookmarks } from "../../utils/bookmarkStorage";

function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const username = localStorage.getItem("username");
    try {
      const bm = loadBookmarks(username);
      setBookmarks(bm || []);
    } catch (e) {
      setBookmarks([]);
    }

    const onBookmarksUpdated = () => {
      try {
        const bm = loadBookmarks(localStorage.getItem("username"));
        setBookmarks(bm || []);
      } catch (err) {
        setBookmarks([]);
      }
    };

    window.addEventListener("bookmarksUpdated", onBookmarksUpdated);
    return () => window.removeEventListener("bookmarksUpdated", onBookmarksUpdated);
  }, []);

  return (
    <MainLayout>
      <Box sx={{ px: 5, pt: 4, pb: 5 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
          My Bookmarks
        </Typography>

        {bookmarks.length === 0 ? (
          <Typography sx={{ color: "#667085" }}>No bookmarks yet.</Typography>
        ) : (
          <Stack spacing={2}>
            {bookmarks.map((item) => (
              <Card key={item.id} sx={{ p: 2 }}>
                <SearchResultCard item={item} onPreview={() => {}} onDelete={() => {}} />
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </MainLayout>
  );
}

export default BookmarksPage;
