import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import comerciosData from '../../Components/Comercios/comercios.json';

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
} from '@mui/material';

import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

// Tema personalizado inspirado em iFood
const theme = createTheme({
  palette: {
    primary: {
      main: '#d92f27', // vermelho vibrante iFood
    },
    background: {
      default: '#fff',
      paper: '#fafafa',
    },
  },
  typography: {
    fontFamily: `'Roboto', sans-serif`,
    h5: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '1.1rem',
    },
  },
});

export default function Login() {
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const inputRef = useRef(null);

  const handleLogin = () => {
    // Remove foco do input para evitar warning aria-hidden
    if (inputRef.current) {
      inputRef.current.blur();
    }

    const tipos = ['lanchonetes', 'mercadinhos', 'farmacias', 'saloes', 'igrejas', 'escolas'];

    for (const tipo of tipos) {
      const lista = comerciosData[tipo] || [];
      const comercio = lista.find(c => c.numero === telefone);
      if (comercio) {
        const comercioComProdutos = {
          ...comercio,
          produtos: Array.isArray(comercio.produtos) ? comercio.produtos : [],
        };

        localStorage.setItem('comercioLogado', JSON.stringify(comercioComProdutos));

        const keyProdutos = `produtos-${comercio.numero}`;
        const produtosExistentes = localStorage.getItem(keyProdutos);
        if (!produtosExistentes) {
          localStorage.setItem(keyProdutos, JSON.stringify(comercioComProdutos.produtos));
        }
        console.log('Comercio salvo:', comercioComProdutos);
        console.log('LocalStorage:', localStorage.getItem('comercioLogado'));

       setTimeout(() => {
      navigate('/EditorProdutos');
    }, 100);
    
        return;
      }
    }

    setErro('Número não encontrado. Verifique o número ou cadastre o comércio.');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xs" sx={{ mt: 12 }}>
        <Box
          sx={{
            p: 5,
            bgcolor: 'background.paper',
            boxShadow: 4,
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Typography variant="h5" component="h1" color="primary" gutterBottom>
            Login do Comerciante
          </Typography>

          <TextField
            inputRef={inputRef}
            label="Número de celular"
            variant="outlined"
            fullWidth
            value={telefone}
            onChange={e => setTelefone(e.target.value)}
            placeholder="+55 99 99999-9999"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneAndroidIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
              '& input::placeholder': {
                fontStyle: 'italic',
                color: '#999',
              },
            }}
          />

          {erro && <Alert severity="error" sx={{ width: '100%' }}>{erro}</Alert>}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleLogin}
            sx={{
              mt: 1,
              borderRadius: 3,
              py: 1.5,
              boxShadow: '0 4px 12px rgba(217, 47, 39, 0.5)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(217, 47, 39, 0.8)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Entrar
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
