import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthContext } from './context/authContext';

const authContextValue = {
  token: null,
  userId: null,
  isAdmin: false,
  login: (token, userId, isAdmin) => {
  },
  logout: () => {
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContext.Provider value={authContextValue}>
      <App />
    </AuthContext.Provider>
  </React.StrictMode>
);

reportWebVitals();