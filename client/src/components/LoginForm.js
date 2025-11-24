import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";

const LoginForm = (props) => {
  const navigate = useNavigate();
  const authContext = React.useContext(AuthContext);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // for input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/users/login",
        loginData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!response.data || !response.data.token || !response.data.userId) {
        setError("No token or userId received in response. Cannot log in.");
        return;
      }

      // Save login
      authContext.login(response.data.token, {
        userId: response.data.userId,
        username: response.data.username,
        firstName: response.data.firstName,
        lastName: response.data.lastName
      });      

      navigate("/home");
    } catch (e) {
      if (e.response) {
        setError(e.response.data.message || "Login failed. Please try again.");
      } else {
        setError("Network error. Please try again.");
      }
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
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 2,
          color: "#4267B2",
        }}
      >
        Log Into BookTalk
      </Typography>

      <Paper
        elevation={3}
        sx={{
          width: { xs: "90%", sm: 400 },
          p: 4,
          borderRadius: 2,
          backgroundColor: "#ffffff",
        }}
      >
        <Grid
          container
          direction="column"
          spacing={2}
          justifyContent="center"
        >
          {/* Show error messages */}
          {error && (
            <Grid item>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}

          <Grid item>
            <TextField
              label="Email"
              variant="outlined"
              type="text"
              name="email"
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                backgroundColor: "#4267B2",
                "&:hover": { backgroundColor: "#166fe5" },
              }}
            >
              Log In
            </Button>
          </Grid>

          <Grid item textAlign="center">
            <Link
              href="#"
              underline="hover"
              sx={{ color: "#1877f2", fontSize: "0.9rem" }}
            >
              Forgot account?
            </Link>
          </Grid>

          <Grid item>
            <hr style={{ border: "none", borderTop: "1px solid #dadde1" }} />
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              fullWidth
              onClick={props.showSignup}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                backgroundColor: "#42b72a",
                "&:hover": { backgroundColor: "#36a420" },
              }}
            >
              Create new account
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default LoginForm;
