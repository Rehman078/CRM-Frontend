import React, { useState } from "react";
import logo from "../assets/crm.png";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContaxt";
import { loginUser } from "../services/AuthApi";
import { Toaster, toast } from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      login(data.data);
      navigate("/");
      toast.success("Successfully logged in!");
    } catch (err) {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
    
      <Toaster position="top-right" reverseOrder={false} />
      <Paper
        elevation={24}
        sx={{
          pb: 5,
          pt: 3,
          px: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Centered Logo */}
        <Box
          component="img"
          src={logo}
          alt="logo"
          sx={{
            width: "130px",
            height: "auto",
          }}
        />
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        {/* Form */}
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 2 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
