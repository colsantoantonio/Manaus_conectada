// pages/PerfilComercio.tsx
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Snackbar,
  Alert,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Sidebar from '../../Components/sidbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PerfilComercio() {
  const navigate = useNavigate();
  const [comercio, setComercio] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dados, setDados] = useState({
    nome: '',
    numero: '',
    horario: '',
    entrega: '',
    logo: '',
    panfleto: '',
    localizacao: '',
  });

  useEffect(() => {
    const comercioString = localStorage.getItem('comercioLogado');
    if (comercioString) {
      const comercioObj = JSON.parse(comercioString);
      setComercio(comercioObj);
      setDados({
        nome: comercioObj.nome || '',
        numero: comercioObj.numero || '',
        horario: comercioObj.horario || '',
        entrega: comercioObj.entrega || '',
        logo: comercioObj.logo || '',
        panfleto: comercioObj.panfleto || '',
        localizacao: comercioObj.localizacao || '',
      });
    } else {
      navigate('/LoginComercio', { replace: true });
    }
  }, [navigate]);

  const handleSalvar = async () => {
    try {
      const res = await axios.put(
        `https://manaus-conectada.onrender.com/api/comercios/${comercio.numero}`,
        dados
      );
      const atualizado = res.data.comercio;
      localStorage.setItem('comercioLogado', JSON.stringify(atualizado));
      setComercio(atualizado);
      setSnackbarOpen(true);
    } catch (err) {
      alert('Erro ao atualizar perfil');
      console.error('Erro ao salvar alterações:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('comercioLogado');
    navigate('/LoginComercio', { replace: true });
  };

  return (
    <Sidebar>
      <Container maxWidth="sm" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            src={dados.logo || ''}
            alt={dados.nome}
            sx={{ width: 120, height: 120, margin: 'auto', mb: 2, border: '3px solid #d92f27' }}
          />
          <Typography variant="h4" fontWeight="700">{dados.nome}</Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{ mt: 1, borderRadius: 3 }}
          >
            Sair
          </Button>
        </Box>

        <Stack spacing={2} sx={{ mb: 4 }}>
          <TextField
            label="Nome"
            fullWidth
            value={dados.nome}
            onChange={(e) => setDados({ ...dados, nome: e.target.value })}
          />
          <TextField
            label="Número de telefone"
            fullWidth
            value={dados.numero}
            onChange={(e) => setDados({ ...dados, numero: e.target.value })}
          />
          <TextField
            label="Horário de funcionamento"
            fullWidth
            value={dados.horario}
            onChange={(e) => setDados({ ...dados, horario: e.target.value })}
            placeholder="Ex: 08:00 - 20:00"
          />
          <FormControl fullWidth>
            <InputLabel>Entrega</InputLabel>
            <Select
              value={dados.entrega}
              label="Entrega"
              onChange={(e) => setDados({ ...dados, entrega: e.target.value })}
            >
              <MenuItem value="Sim">Sim</MenuItem>
              <MenuItem value="Não">Não</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="URL do Logo"
            fullWidth
            value={dados.logo}
            onChange={(e) => setDados({ ...dados, logo: e.target.value })}
          />
          <TextField
            label="URL do Panfleto"
            fullWidth
            value={dados.panfleto}
            onChange={(e) => setDados({ ...dados, panfleto: e.target.value })}
          />
          <TextField
            label="Localização (URL do Google Maps)"
            fullWidth
            value={dados.localizacao}
            onChange={(e) => setDados({ ...dados, localizacao: e.target.value })}
            placeholder="https://goo.gl/maps/..."
          />
          <Button variant="contained" sx={{ bgcolor: '#d92f27' }} onClick={handleSalvar}>
            Salvar Alterações
          </Button>
        </Stack>

        <Button variant="text" onClick={() => navigate('/')}>Voltar para a página inicial</Button>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Perfil atualizado com sucesso!
          </Alert>
        </Snackbar>
      </Container>
    </Sidebar>
  );
}
