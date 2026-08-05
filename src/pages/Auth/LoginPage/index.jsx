import { useState } from "react";
import {Avatar,Box,Button,Card,CardContent,FormControl,Grid,IconButton,InputAdornment,MenuItem,Select,TextField,
  Typography,
  Link,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
    role: "",
    showPassword: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleShow = () => setValues((v) => ({ ...v, showPassword: !v.showPassword }));

  const validate = () => {
    const err = {};
    if (!values.username.trim()) err.username = "Username is required";
    if (!values.password) err.password = "Password is required";
    if (!values.role) err.role = "Please select role";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Mock login logic (frontend only)
    // Accept any credentials; route by role for demo purposes
    // Persist role and username for client-side access control
    try {
      localStorage.setItem("userRole", values.role || "Employee");
      localStorage.setItem("username", values.username || "");
    } catch (err) {
      // ignore storage errors
    }

    // Redirect all users to homepage (dashboard)
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        backgroundImage: 'linear-gradient(180deg, rgba(248,248,252,0.92), rgba(248,248,252,0.92)), url("/backgroundlogo.png")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        px: { xs: 4, md: 6 },
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 460 }}>
        <Card sx={{ borderRadius: 4, boxShadow: '0 24px 80px rgba(15, 23, 42, 0.12)', backdropFilter: 'blur(8px)' }}>
          <CardContent sx={{ p: { xs: 4, md: 5 }, backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: '#2563EB' }}>
                <LockIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>Sign in to your account</Typography>
                <Typography variant="body2" color="text.secondary">Enter your credentials to continue</Typography>
              </Box>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Username"
                value={values.username}
                onChange={handleChange('username')}
                error={Boolean(errors.username)}
                helperText={errors.username}
                sx={{ mb: 2 }}
                required
              />

              <TextField
                fullWidth
                label="Password"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                error={Boolean(errors.password)}
                helperText={errors.password}
                sx={{ mb: 2 }}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShow} edge="end">
                        {values.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth sx={{ mb: 3 }} error={Boolean(errors.role)}>
                <Select value={values.role} displayEmpty onChange={handleChange('role')}>
                  <MenuItem value="">Select Role</MenuItem>
                  <MenuItem value="admin">admin</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Employee">Employee</MenuItem>
                </Select>
                {errors.role && (
                  <Typography variant="caption" color="error">{errors.role}</Typography>
                )}
              </FormControl>

              <Button type="submit" variant="contained" fullWidth sx={{ py: 1.8, mb: 1 }}>
                Login
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Link component="button" variant="body2" onClick={() => alert('Forgot password flow not implemented (mock UI)')}>
                  Forgot Password?
                </Link>

                <Link component="button" variant="body2" onClick={() => navigate('/signup')}>
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
