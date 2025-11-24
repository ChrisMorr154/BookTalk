import { Grid } from "@mui/material";
import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const AuthPage = () => {
  const [loginShow, setLoginShow] = useState(true);

  const handleSignup = () => {
    console.log("Switching forms: ", loginShow ? "Register" : "Login");
    setLoginShow((prev) => !prev);
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={5}
      sx={{ minHeight: "100vh", paddingTop: "50px" }}
    >
      <Grid item>
        {loginShow ? (
          <LoginForm showSignup={handleSignup} />
        ) : (
          <RegisterForm showSignup={handleSignup} />
        )}
      </Grid>
    </Grid>
  );
};

export default AuthPage;
