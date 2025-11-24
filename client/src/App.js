import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext"; 
import Home from "./pages/Home";
import AuthPage from "./pages/authPage";
import Profile from "./pages/Profile";
import Feed from "./components/Feed";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/feed" element={<Feed />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
