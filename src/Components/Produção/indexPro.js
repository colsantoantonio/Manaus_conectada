import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material';

const EmProducao = () => {
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Tempo do loading
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box 
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 123, 255, 0.2)', // Azul claro com opacidade
          zIndex: 1300
        }}
      >
        <CircularProgress size={isSmall ? 40 : 60} sx={{ color: '#1976d2' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        px: 2,
        backgroundColor: '#f8fafc',
        textAlign: 'center'
      }}
    >
      <Typography variant={isSmall ? 'h4' : 'h3'} gutterBottom>
        🚧 Página em Produção
      </Typography>
      <Typography variant={isSmall ? 'body1' : 'h6'}>
        Estamos trabalhando para disponibilizar esse conteúdo em breve.
      </Typography>
    </Box>
  );
};

export default EmProducao;

