import React, { useContext } from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const Header = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const doLogout = () => {
    logout();         
    navigate('/login'); 
  };

return (
  <AppBar position="static" sx={{ backgroundColor: '#4267B2' }}>
    <Toolbar sx={{ display: "flex", alignItems: "center" }}>
      
      <Button color="inherit" component={Link} to="/home">
        BookTalk
      </Button>

      <Box sx={{ flexGrow: 1 }} />

      <Button color="inherit" component={Link} to="/home">
        Home
      </Button>
      <Button color="inherit">
        Notifications
      </Button>
      <Button color="inherit" component={Link} to="/profile">
        Profile
      </Button>
      <Button color="inherit" onClick={doLogout}>
        Logout
      </Button>

    </Toolbar>
  </AppBar>
);
}
export default Header;
