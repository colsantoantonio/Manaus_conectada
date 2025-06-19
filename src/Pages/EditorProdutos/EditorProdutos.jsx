import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  IconButton,
  Stack,
  Avatar,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

export default function EditorProdutos() {
  const navigate = useNavigate();
  const [comercio, setComercio] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({ nome: '', preco: '', categoria: '', imagem: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [confirmSairOpen, setConfirmSairOpen] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const comercioString = localStorage.getItem('comercioLogado');
    if (!comercioString) return navigate('/LoginComercio', { replace: true });

    const comercioObj = JSON.parse(comercioString);
    setComercio(comercioObj);

    fetch(`https://manaus-conectada.onrender.com/api/produtos/${comercioObj.numero}`)
      .then((res) => res.json())
      .then((data) => {
        setProdutos(data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar produtos:', err);
        setCarregando(false);
      });
  }, [navigate]);

  const adicionarProduto = async () => {
    if (!novoProduto.nome.trim() || novoProduto.preco === '' || isNaN(Number(novoProduto.preco))) {
      alert('Preencha nome e preço válidos');
      return;
    }

    const produto = {
      ...novoProduto,
      preco: parseFloat(novoProduto.preco),
      numeroComercio: comercio.numero,
    };

    try {
      const response = await fetch('https://manaus-conectada.onrender.com/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });

      const novo = await response.json();
      setProdutos((prev) => [...prev, novo]);
      setNovoProduto({ nome: '', preco: '', categoria: '', imagem: '' });
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  const removerProduto = async (id) => {
    try {
      await fetch(`https://manaus-conectada.onrender.com/api/produtos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroComercio: comercio.numero }),
      });
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  const atualizarProduto = async (id, campo, valor) => {
    const atualizado = produtos.find((p) => p.id === id);
    const novoValor = campo === 'preco' ? parseFloat(valor) || '' : valor;
    const atualizadoComCampo = { ...atualizado, [campo]: novoValor };

    setProdutos((prev) => prev.map((p) => (p.id === id ? atualizadoComCampo : p)));

    try {
      await fetch(`https://manaus-conectada.onrender.com/api/produtos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...atualizadoComCampo, numeroComercio: comercio.numero }),
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  const sairLogin = () => {
    localStorage.removeItem('comercioLogado');
    navigate('/LoginComercio', { replace: true });
  };

  if (carregando) {
    return (
      <Container sx={{ mt: 6 }}>
        <Typography align="center" variant="h6">Carregando dados do comércio...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4, p: 2, bgcolor: '#fff', borderRadius: 3 }}>
        {comercio.imagem ? (
          <Avatar src={comercio.imagem} sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }} />
        ) : (
          <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}>{comercio.nome[0]}</Avatar>
        )}
        <Typography variant="h4" fontWeight="700">{comercio.nome}</Typography>
        <Button variant="outlined" color="error" onClick={() => setConfirmSairOpen(true)} sx={{ mt: 1 }}>Sair</Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 6 }}>
        <Typography variant="h6" gutterBottom>Adicionar Novo Produto</Typography>
        <Stack spacing={2} mb={2}>
          <TextField label="Nome" value={novoProduto.nome} onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })} fullWidth />
          <TextField label="Preço" type="number" value={novoProduto.preco} onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })} fullWidth />
          <TextField label="Categoria" value={novoProduto.categoria} onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })} fullWidth />
          <TextField label="Imagem" value={novoProduto.imagem} onChange={(e) => setNovoProduto({ ...novoProduto, imagem: e.target.value })} fullWidth />
          <Button variant="contained" onClick={adicionarProduto}>Adicionar</Button>
        </Stack>
      </Paper>

      <Typography variant="h6" fontWeight="600" mb={2}>Produtos Cadastrados</Typography>
      {produtos.map((prod) => (
        <Paper key={prod.id} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <TextField label="Nome" value={prod.nome} onChange={(e) => atualizarProduto(prod.id, 'nome', e.target.value)} fullWidth variant="standard" />
            <TextField label="Preço" type="number" value={prod.preco} onChange={(e) => atualizarProduto(prod.id, 'preco', e.target.value)} fullWidth variant="standard" />
            <TextField label="Categoria" value={prod.categoria} onChange={(e) => atualizarProduto(prod.id, 'categoria', e.target.value)} fullWidth variant="standard" />
            <TextField label="Imagem" value={prod.imagem} onChange={(e) => atualizarProduto(prod.id, 'imagem', e.target.value)} fullWidth variant="standard" />
          </Box>
          <IconButton color="error" onClick={() => removerProduto(prod.id)}><DeleteIcon /></IconButton>
        </Paper>
      ))}

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">Produto adicionado com sucesso!</Alert>
      </Snackbar>

      <Dialog open={confirmSairOpen} onClose={() => setConfirmSairOpen(false)}>
        <DialogTitle>Deseja realmente sair do login?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmSairOpen(false)}>Cancelar</Button>
          <Button onClick={sairLogin} color="error" variant="contained">Sair</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
