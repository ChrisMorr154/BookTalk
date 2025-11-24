import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import AuthPage from '../pages/authPage';
import RequiredAuth from './AuthRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route 
        path="/feed" 
        element={
          <RequiredAuth>
            <Home />
          </RequiredAuth>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <RequiredAuth>
            <Profile />
          </RequiredAuth>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
