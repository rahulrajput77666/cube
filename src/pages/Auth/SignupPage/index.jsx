import { useState } from "react";
import {Avatar,Box,Button,Card,CardContent,FormControl,Grid,MenuItem,Select,TextField,Typography,Link,} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";
import PageBackgroundWrapper from "../../../components/PageBackgroundWrapper";

function SignupPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirm: "",
    role: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const err = {};
    if (!values.fullName.trim()) err.fullName = "Full name is required";
    if (!values.email.trim()) err.email = "Email is required";
    if (!values.username.trim()) err.username = "Username is required";
    if (!values.password) err.password = "Password is required";
    if (values.password !== values.confirm) err.confirm = "Passwords do not match";
    if (!values.role) err.role = "Please select role";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Mock signup: navigate back to login with username prefilled
    navigate('/login', { state: { username: values.username } });
  };

  return (
    <PageBackgroundWrapper>
      <Grid container sx={{ minHeight: '100vh' }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 6 }}>
        <Box sx={{ maxWidth: 520 }}>
          <Typography variant="h3" fontWeight={800} sx={{ color: '#0F172A' }}>
            Create Account
          </Typography>
          <Typography sx={{ mt: 2, color: '#667085' }}>
            Create a role-based account.
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Card sx={{ width: '100%', maxWidth: 520, borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#2563EB' }}>
                <PersonAddIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>Create your account</Typography>
              
              </Box>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField fullWidth label="Full name" value={values.fullName} onChange={handleChange('fullName')} sx={{ mb: 2 }} error={Boolean(errors.fullName)} helperText={errors.fullName} />
              <TextField fullWidth label="Email" value={values.email} onChange={handleChange('email')} sx={{ mb: 2 }} error={Boolean(errors.email)} helperText={errors.email} />
              <TextField fullWidth label="Username" value={values.username} onChange={handleChange('username')} sx={{ mb: 2 }} error={Boolean(errors.username)} helperText={errors.username} />
              <TextField fullWidth label="Password" type="password" value={values.password} onChange={handleChange('password')} sx={{ mb: 2 }} error={Boolean(errors.password)} helperText={errors.password} />
              <TextField fullWidth label="Confirm Password" type="password" value={values.confirm} onChange={handleChange('confirm')} sx={{ mb: 2 }} error={Boolean(errors.confirm)} helperText={errors.confirm} />

              <FormControl fullWidth sx={{ mb: 3 }} error={Boolean(errors.role)}>
                <Select value={values.role} displayEmpty onChange={handleChange('role')}>
                  <MenuItem value="">Select Role</MenuItem>
                  <MenuItem value="admin">admin</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Employee">Employee</MenuItem>
                </Select>
                {errors.role && <Typography variant="caption" color="error">{errors.role}</Typography>}
              </FormControl>

              <Button type="submit" variant="contained" fullWidth sx={{ py: 1.8, mb: 1 }}>Create Account</Button>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Link component="button" variant="body2" onClick={() => navigate('/login')}>Already have an account? Sign in</Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    </PageBackgroundWrapper>
  );
}

export default SignupPage;
