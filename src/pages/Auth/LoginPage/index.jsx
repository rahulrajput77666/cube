import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../services/authService";
import { saveAuthSession } from "../../../utils/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
    showPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError("");
  };

  const toggleShow = () =>
    setValues((v) => ({ ...v, showPassword: !v.showPassword }));

  const validate = () => {
    const err = {};
    if (!values.username.trim()) err.username = "Username is required";
    if (!values.password) err.password = "Password is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const response = await loginUser({
        username: values.username.trim(),
        password: values.password,
      });

      const authPayload =
        response?.data && typeof response.data === "object"
          ? response.data
          : response || {};
      const token =
        authPayload?.token ||
        authPayload?.jwt ||
        authPayload?.accessToken ||
        authPayload?.authToken ||
        "";
      const username =
        authPayload?.username ||
        authPayload?.userName ||
        authPayload?.email ||
        values.username;
      const roles = Array.isArray(authPayload?.roles)
        ? authPayload.roles
        : authPayload?.role
          ? [authPayload.role]
          : [];
      const primaryRole = roles[0] || authPayload?.role || "EMPLOYEE";

      saveAuthSession({
        token,
        username,
        roles,
        role: primaryRole,
        user: {
          username,
          roles,
        },
      });

      localStorage.setItem("username", username);
      localStorage.setItem("role", primaryRole);
      localStorage.setItem("userRole", primaryRole);
      localStorage.setItem("roles", JSON.stringify(roles));

      navigate("/role-home");
    } catch (error) {
      const message =
        error?.message ||
        "Login failed. Please check your credentials and try again.";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8FAFC",
        backgroundImage:
          'linear-gradient(180deg, rgba(248,248,252,0.92), rgba(248,248,252,0.92)), url("/backgroundlogo.png")',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        px: { xs: 4, md: 6 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 460 }}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
            backdropFilter: "blur(8px)",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 4, md: 5 },
              backgroundColor: "rgba(255,255,255,0.95)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: "#2563EB" }}>
                <LockIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Sign in to your account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter your credentials to continue
                </Typography>
              </Box>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Username"
                value={values.username}
                onChange={handleChange("username")}
                error={Boolean(errors.username)}
                helperText={errors.username}
                sx={{ mb: 2 }}
                required
              />

              <TextField
                fullWidth
                label="Password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                error={Boolean(errors.password)}
                helperText={errors.password}
                sx={{ mb: 2 }}
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShow} edge="end">
                          {values.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {serverError && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {serverError}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ py: 1.8, mb: 1 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Login"}
              </Button>

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() =>
                    alert(
                      "Forgot password flow not implemented yet. Add backend endpoint here."
                    )
                  }
                >
                  Forgot Password?
                </Link>

                <Link component="button" variant="body2" onClick={() => navigate("/signup")}>
                  Don't have an account? Create Account
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default LoginPage;

