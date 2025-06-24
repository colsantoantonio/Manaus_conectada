import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Avatar,
  GlobalStyles,
} from '@mui/material';
import axios from 'axios';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import logo from '../../imgs/manausconectada.png';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // verde mais sofisticado
    },
    secondary: {
      main: '#fdd835', // amarelo quente
    },
    background: {
      default: '#f0f4f3',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: `'Poppins', sans-serif`,
    h5: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
});

export default function Login() {
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleLogin = async () => {
    if (inputRef.current) inputRef.current.blur();
    try {
      const response = await axios.post('https://manaus-conectada.onrender.com/api/login', {
        numero: telefone,
      });

      const comercio = response.data.estabelecimento;
      const comercioComProdutos = {
        ...comercio,
        produtos: Array.isArray(comercio.produtos) ? comercio.produtos : [],
      };

      localStorage.setItem('comercioLogado', JSON.stringify(comercioComProdutos));
      const keyProdutos = `produtos-${comercio.numero}`;
      if (!localStorage.getItem(keyProdutos)) {
        localStorage.setItem(keyProdutos, JSON.stringify(comercioComProdutos.produtos));
      }

      navigate('/EditorProdutos');
    } catch (error) {
      setErro('Número não encontrado. Verifique o número ou cadastre o comércio.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{ body: { margin: 0, background: 'linear-gradient(to bottom, #e0f2f1, #a5d6a7)' } }} />
      
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              p: 5,
              bgcolor: 'background.paper',
              borderRadius: 4,
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Avatar
              alt="Manaus Conectada"
              src={logo}
              variant="rounded"
              sx={{ width: 100, height: 100, mb: 1 }}
            />

            <Typography variant="h5" color="primary" align="center">
              Manaus Conectada
            </Typography>

            <TextField
              inputRef={inputRef}
              label="Senha"
              variant="outlined"
              fullWidth
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="************"
              type="password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="primary" />
                  </InputAdornment>
                ),
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
                '& input::placeholder': {
                  fontStyle: 'italic',
                  color: '#aaa',
                },
              }}
            />


            {erro && <Alert severity="error" sx={{ width: '100%' }}>{erro}</Alert>}

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleLogin}
              sx={{
                mt: 1,
                borderRadius: 8,
                py: 1.5,
                fontWeight: 600,
                backgroundColor: 'primary.main',
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: '#388e3c',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              Entrar
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
