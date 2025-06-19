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
} from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

const theme = createTheme({
  palette: {
    primary: { main: '#d92f27' },
    background: { default: '#fff', paper: '#fafafa' },
  },
  typography: {
    fontFamily: `'Roboto', sans-serif`,
    h5: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700, fontSize: '1.1rem' },
  },
});

export default function Login() {
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleLogin = async () => {
    if (inputRef.current) inputRef.current.blur();
    setErro('');

    try {
      const res = await fetch(`https://manaus-conectada.onrender.com/api/comercio/${telefone}`);
      const data = await res.json();

      if (res.ok && data && data.numero === telefone) {
        localStorage.setItem('comercioLogado', JSON.stringify(data));
        navigate('/EditorProdutos');
      } else {
        setErro('Número não encontrado. Verifique o número ou cadastre o comércio.');
      }
    } catch (err) {
      console.error('Erro ao tentar login:', err);
      setErro('Erro ao tentar login. Verifique sua conexão ou tente novamente.');
    }
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
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="+55 99 99999-9999"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneAndroidIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 2 },
              '& input::placeholder': { fontStyle: 'italic', color: '#999' },
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
