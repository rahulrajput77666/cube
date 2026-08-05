import {Box,TextField,Button,InputAdornment,Typography,Paper,List,ListItemButton,ListItemIcon,ListItemText,CircularProgress,} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

/*
=========================================================
SEARCH BAR COMPONENT

PURPOSE
- Search knowledge documents
- Support keyword based repository search
- Support search suggestions

CURRENT
- Uses frontend state
- Suggestions generated from mockKnowledge

FUTURE BACKEND INTEGRATION

SEARCH API

GET /knowledge/search

Query Params:

?page=1
&pageSize=10
&search=oracle
&sortBy=relevance

---------------------------------------------------------

SUGGESTION API

GET /knowledge/suggestions?q=ora

Response:

[
  {
    "id": 1,
    "title": "Oracle Hook Registration"
  },
  {
    "id": 2,
    "title": "Oracle ATM Configuration"
  }
]

=========================================================
*/

function SearchBar({
  searchTerm,
  setSearchTerm,
  onSearch,
  suggestions = [],
  onSuggestionSelect,
  isLoading = false,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mt: 4,
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          flex: 1,
          position: "relative",
        }}
      >
        {/* =====================================================
            SEARCH INPUT

            CURRENT:
            Frontend controlled state

            FUTURE:
            Can remain unchanged even after
            backend integration.

        ===================================================== */}

        <TextField
          fullWidth
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
            onSearch();
            }
          }}
          placeholder="Search anything..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: "#667085",
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 74,
              borderRadius: 3,
            },
          }}
        />

        {/* =====================================================
            SEARCH SUGGESTIONS

            FUTURE:

            Replace frontend suggestions
            with API response.

            GET /knowledge/suggestions?q=oracle

        ===================================================== */}

        {searchTerm.trim() &&
          suggestions.length > 0 && (
            <Paper
              elevation={6}
              sx={{
                position: "absolute",
                top: 82,
                left: 0,
                right: 0,
                zIndex: 1000,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  backgroundColor:
                    "#F9FAFB",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "#667085",
                    letterSpacing: 1,
                  }}
                >
                  SUGGESTIONS
                </Typography>
              </Box>

              <List disablePadding>
                {suggestions.map(
                  (item) => (
                    <ListItemButton
                      key={item.id}
                      onClick={() => {
                        onSuggestionSelect(
                          item
                        );
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                        }}
                      >
                        <SearchIcon
                          fontSize="small"
                        />
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          item.title
                        }
                      />
                    </ListItemButton>
                  )
                )}
              </List>

              <Box
                sx={{
                  borderTop:
                    "1px solid #E5E7EB",
                }}
              >
                <ListItemButton
                  onClick={() => {
                    if (onSearch) {
                      onSearch();
                    }
                  }}
                >
                  <Typography
                    sx={{
                      color: "#2563EB",
                      fontWeight: 600,
                    }}
                  >
                    View all results for "
                    {searchTerm}"
                  </Typography>

                  <Typography
                  sx={{
                  ml: 1,
                  color: "#2563EB",
                  fontWeight: 700,
                  }}
                  >
  →
</Typography>
                </ListItemButton>
              </Box>
            </Paper>
          )}

        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: "#667085",
          }}
        >
          Examples: oracle hook,
          weblogic deployment, atm
          withdrawal, json parser
        </Typography>
      </Box>

      {/* =====================================================
          SEARCH BUTTON

          FUTURE:

          Trigger backend search API.

          GET /knowledge/search

      ===================================================== */}

      <Button
        variant="contained"
        onClick={onSearch}
        disabled={isLoading}
        sx={{
          minWidth: 150,
          height: 74,
          borderRadius: 3,
          fontWeight: 600,
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Search"
        )}
      </Button>

      {/* =====================================================
          FUTURE FEATURES

          ENTER KEY SEARCH

          AUTOCOMPLETE

          RECENT SEARCHES

          POPULAR SEARCHES

          ADVANCED FILTERS

      ===================================================== */}
    </Box>
  );
}

export default SearchBar;