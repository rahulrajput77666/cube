import { Box } from "@mui/material";
import Header from "../components/Header/HeaderSelector";

/*
=========================================================
MAIN APPLICATION LAYOUT

CURRENT:
- Renders common Header
- Renders page content

FUTURE BACKEND INTEGRATION:

Authentication:
- User Login
- Session Validation
- JWT Token Handling

Authorization:
- Employee
- Manager
- Admin

Global Features:
- Loading Spinner
- Error Handling
- Session Timeout
- Unauthorized Access

=========================================================

Example Future Flow:

1. User logs in
2. Token stored
3. App loads user profile
4. User role available globally

{
  "userId": "1001",
  "username": "Arjun Singh",
  "role": "EMPLOYEE"
}

Header will receive user information.

=========================================================
*/

const MainLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F8FAFC",
      }}
    >
      {/* =====================================================
          TODO BACKEND

          CURRENT:
          Static Header

          FUTURE:
          Header receives logged-in user information

          Example:

          <Header
            user={user}
            role={role}
          />

      ===================================================== */}
      <Header />

      {/* =====================================================
          TODO BACKEND

          FUTURE:

          Global Loading Example:

          {loading && <Loader />}

          Global Error Example:

          {error && <ErrorBanner />}

          Session Expiry Example:

          If token expired:
          redirect("/login")

      ===================================================== */}

      <Box
        sx={{
          pt: "96px",
          px: 4,
          pb: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;