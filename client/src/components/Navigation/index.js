import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import { useNavigate } from 'react-router-dom';

const pages = ['Home', 'Search', 'Review', 'MyPage'];

const NavAppBar = () => {

  const navigate = useNavigate();
  
  const [activePage, updateActivePage] = React.useState('Home');

  const handleNavigatePages = (pg) => {
    var page = pg;
    updateActivePage(page);

    if (page == 'Home') {
      page = '';
    }
    console.log("Changing to page: /" + page);
    navigate("/" + page);
  };

  return (
    <AppBar position="sticky" style={{ backgroundColor: '#5139a8' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleNavigatePages(page)}
                sx={{ my: 2, color: 'white', display: 'block', marginRight: "25px",
                  fontWeight: ((page == 'Home') && "bold") }}
                // style={{ borderBottom: (page == activePage) ? "3px solid white" : "3px solid transparent" }}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}


export default NavAppBar;