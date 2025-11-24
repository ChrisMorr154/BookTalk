import React, { useState } from "react";
import {
  Paper,
  TextField,
  Grid,
  Button,
  Box,
  Typography,
  Link
} from "@mui/material";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = (props) => {
  const authContext = React.useContext(AuthContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  //validate fields
  const validateInputs = () => {
    const { firstName, lastName, username, email, password } = userData;
    if (!firstName || !lastName || !username || !email || !password) {
      setError("All fields are required");
      return false;
    }
    setError("");
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/users/register",
        userData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && response.data.token) {
        authContext.login(response.data.token, response.data.id, false);
        if (props.closeForm) {
          props.closeForm();
        } else {
          navigate("/home");
        }
      } else {
        setError("Unexpected response format from server.");
      }
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: "#4267B2",
          fontWeight: "bold",
          mb: 2,
          textAlign: "center",
        }}
      >
        Register Now!
      </Typography>

      <Paper
        elevation={3}
        sx={{
          width: { xs: "90%", sm: 430 },
          p: 3,
          borderRadius: 2,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
          Create a new account
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          It’s quick and easy.
        </Typography>

        {/* Show and error if occurs */}
        {error && (
          <Typography color="error" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              variant="outlined"
              type="text"
              name="firstName"
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              variant="outlined"
              type="text"
              name="lastName"
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>

          {/* Username */}
          <Grid item xs={12}>
            <TextField
              label="Username"
              variant="outlined"
              type="text"
              name="username"
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              name="email"
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12}>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        {/* Sign Up Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleRegister}
          sx={{
            mt: 2,
            textTransform: "none",
            fontWeight: "bold",
            backgroundColor: "#42b72a",
            "&:hover": { backgroundColor: "#36a420" },
          }}
        >
          Sign Up
        </Button>

        {/* "Already have an account?" link */}
        {!props.closeForm && (
          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link
                href="#"
                onClick={props.showSignup}
                sx={{
                  color: "#1877f2",
                  fontWeight: "bold",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Log In
              </Link>
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default RegisterForm;
