import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Collapse,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const MercadoPage = () => {
  const [entregas, setEntregas] = useState([]);
  const [pedido, setPedido] = useState('');
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [enderecoRetirada, setEnderecoRetirada] = useState('');
  const [mercado, setMercado] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const carregarEntregas = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/entregas');
      setEntregas(res.data.reverse());
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao carregar entregas', severity: 'error' });
    }
    setLoading(false);
  };

  const criarEntrega = async () => {
    if (!mercado.trim() || !pedido.trim() || !enderecoRetirada.trim() || !enderecoEntrega.trim()) {
      setSnackbar({ open: true, message: 'Preencha todos os campos!', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/entregas', {
        mercado,
        pedido,
        endereco: enderecoEntrega,
        retirada: enderecoRetirada,
        cliente: 'Mercado Central',
      });
      setPedido('');
      setEnderecoEntrega('');
      setEnderecoRetirada('');
      setMercado('');
      setMostrarFormulario(false);
      carregarEntregas();
      setSnackbar({ open: true, message: 'Entrega criada com sucesso!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao criar entrega', severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarEntregas();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6, bgcolor: '#fff', minHeight: '100vh', pb: 4 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mb={4}
        sx={{ gap: 1 }}
      >
        <RestaurantMenuIcon sx={{ fontSize: 50, color: '#1565c0' }} />
        <Typography
          variant="h4"
          fontWeight="700"
          color="#1565c0"
          sx={{ fontFamily: "'Poppins', sans-serif" }}
        >
          IMercado
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500, textAlign:"center" }}>
          Sistema de entregas do nosso Bairro sem vinculo empregaticios!
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        {!mostrarFormulario ? (
          <Button
            variant="contained"
            fullWidth
            onClick={() => setMostrarFormulario(true)}
            disabled={loading}
            sx={{
              bgcolor: '#1565c0',
              '&:hover': { bgcolor: '#0d47a1' },
              borderRadius: 4,
              py: 1.5,
              fontWeight: 700,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: '0 4px 10px rgb(21 101 192 / 0.4)',
            }}
            startIcon={<ShoppingCartIcon />}
          >
            Novo Pedido de entrega
          </Button>
        ) : (
          <Collapse in={mostrarFormulario}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0 4px 15px rgb(21 101 192 / 0.25)',
                bgcolor: '#fff',
              }}
            >
              <Typography
                variant="h6"
                mb={2}
                fontWeight={600}
                color="#1565c0"
                textAlign="center"
                sx={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Criar Novo Pedido
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Nome do Mercadinho"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={mercado}
                    onChange={(e) => setMercado(e.target.value)}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Pedido"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={pedido}
                    onChange={(e) => setPedido(e.target.value)}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Endereço de Retirada"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={enderecoRetirada}
                    onChange={(e) => setEnderecoRetirada(e.target.value)}
                    disabled={loading}
                    InputProps={{
                      startAdornment: <LocationOnIcon sx={{ mr: 1, color: '#1565c0' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Endereço de Entrega"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={enderecoEntrega}
                    onChange={(e) => setEnderecoEntrega(e.target.value)}
                    disabled={loading}
                    InputProps={{
                      startAdornment: <LocationOnIcon sx={{ mr: 1, color: '#1565c0' }} />,
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  display="flex"
                  justifyContent="space-between"
                  gap={2}
                  mt={1}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={criarEntrega}
                    disabled={loading}
                    sx={{
                      bgcolor: '#1565c0',
                      '&:hover': { bgcolor: '#0d47a1' },
                      borderRadius: 4,
                      py: 1.5,
                      fontWeight: 700,
                      textTransform: 'none',
                    }}
                  >
                    Confirmar Pedido
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setMostrarFormulario(false)}
                    disabled={loading}
                    sx={{
                      borderColor: '#1565c0',
                      color: '#1565c0',
                      borderRadius: 4,
                      py: 1.5,
                      fontWeight: 700,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#0d47a1',
                        color: '#0d47a1',
                        bgcolor: 'rgba(13,71,161,0.1)',
                      },
                    }}
                  >
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Collapse>
        )}
      </Box>

      <Typography
        variant="h5"
        mb={3}
        fontWeight={600}
        color="#1565c0"
        textAlign="center"
        sx={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Pedidos Recentes
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <CircularProgress sx={{ color: '#1565c0' }} />
        </Box>
      )}

      {!loading && entregas.length === 0 && (
        <Typography
          color="text.secondary"
          textAlign="center"
          mb={4}
          sx={{ fontStyle: 'italic' }}
        >
          Nenhum pedido registrado até o momento.
        </Typography>
      )}

      <Grid container spacing={3}>
        {entregas.map((e) => (
          <Grid item xs={12} key={e.id}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                bgcolor: '#f0f7ff',
                borderLeft: e.status === 'aceito' ? '6px solid #2e7d32' : '6px solid #0d47a1',
                boxShadow: '0 3px 10px rgb(21 101 192 / 0.15)',
                cursor: 'default',
                '&:hover': {
                  boxShadow: '0 6px 20px rgb(21 101 192 / 0.3)',
                },
              }}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ color: '#0d47a1' }}
                  gutterBottom
                >
                  {e.mercado}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {e.pedido}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                  <LocationOnIcon sx={{ color: '#0d47a1', fontSize: 18 }} />
                  <Typography variant="body2" color="text.secondary">
                    Retirada: {e.retirada}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                  <LocationOnIcon sx={{ color: '#0d47a1', fontSize: 18 }} />
                  <Typography variant="body2" color="text.secondary">
                    Entrega: {e.endereco}
                  </Typography>
                </Box>
                {e.status === 'aceito' && (
                  <Typography
                    variant="body2"
                    color="success.main"
                    mt={1}
                    fontWeight={600}
                  >
                    Motoqueiro: {e.motoqueiro ? e.motoqueiro : 'Aguardando motoqueiro'}
                  </Typography>
                )}
              </Box>
              <Chip
                label={e.status === 'aceito' ? 'ACEITO' : 'PENDENTE'}
                color={e.status === 'aceito' ? 'success' : 'error'}
                sx={{
                  fontWeight: 700,
                  borderRadius: 3,
                  px: 2,
                  py: 0.5,
                  fontSize: '0.75rem',
                  cursor: 'default',
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', fontWeight: 700 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MercadoPage;