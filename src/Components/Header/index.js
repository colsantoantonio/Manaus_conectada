import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  useTheme,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import GroupIcon from '@mui/icons-material/Group';
import BuildIcon from '@mui/icons-material/Build';
import ArticleIcon from '@mui/icons-material/Article';
import InfoIcon from '@mui/icons-material/Info';
import Logo from "../../imgs/manausconectada.png";

const Navigation = () => {
  const theme = useTheme();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { label: 'Home', to: '/', icon: <HomeIcon /> },
    { label: 'Comércios', to: '/mercadao', icon: <StoreIcon /> },
    { label: 'Comissão', to: '/contato', icon: <GroupIcon /> },
    { label: 'Serviços', to: '/serviços', icon: <BuildIcon /> },
    { label: 'Notícias', to: '/informações', icon: <ArticleIcon /> },
  ];

  return (
    <>
      {/* AppBar */}
            <AppBar 
          position="sticky" 
          sx={{ 
            backgroundColor: theme.palette.info.main,
            display: { xs: 'none', sm: 'block' }  // <<< OCULTA EM MOBILE
          }}
        >
        <Container maxWidth="lg">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Logo no desktop */}
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}
            >
              <Link to="/" style={{ color: theme.palette.common.white, textDecoration: 'none' }}>
                Colônia Santo Antônio
              </Link>
            </Typography>


            {/* Menu Desktop */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
              {menuItems.map(({ label, to }) => (
                <Button
                  key={label}
                  color="inherit"
                  component={Link}
                  to={to}
                  sx={{ textTransform: 'none' }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Bottom Navigation só em mobile */}
        <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: 'flex', sm: 'none' },
          zIndex: 1300,
          borderTop: '1px solid #ccc',
          backgroundColor: '#f5f5f5', // cinza claro
        }}
        elevation={8}
      >
        <BottomNavigation
          showLabels
          value={currentPath}
          sx={{
            width: '100%',
            '& .Mui-selected': {
              color: '#1976d2',
            },
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 12px',
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
            },
          }}
        >
          {menuItems.map(({ label, to, icon }) => (
            <BottomNavigationAction
              key={label}
              label={label}
              value={to}
              icon={icon}
              component={Link}
              to={to}
              sx={{
                color: currentPath === to ? '#1976d2' : '#555',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  borderRadius: '12px',
                },
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default Navigation;
