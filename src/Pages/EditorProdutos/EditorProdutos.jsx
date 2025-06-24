import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Snackbar,
  Alert,
  Avatar,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  IconButton,
  Card,
  Fab,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditorProdutos() {
  const navigate = useNavigate();

  const [comercio, setComercio] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [produtosEditaveis, setProdutosEditaveis] = useState([]);
  const [produtoEdit, setProdutoEdit] = useState(null);
  const [novoProduto, setNovoProduto] = useState({ nome: '', preco: '', categoria: '', imagem: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [confirmSairOpen, setConfirmSairOpen] = useState(false);
  const [abrirNovoProduto, setAbrirNovoProduto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [buscaNome, setBuscaNome] = useState('');

  useEffect(() => {
    const comercioString = localStorage.getItem('comercioLogado');
    if (comercioString) {
      const comercioObj = JSON.parse(comercioString);
      setComercio(comercioObj);

      axios
        .get(`https://manaus-conectada.onrender.com/api/produtos/${comercioObj.numero}`)
        .then((res) => {
          setProdutos(res.data);
          setProdutosEditaveis(res.data.map(p => ({ ...p })));
          setCarregando(false);
        })
        .catch((err) => {
          console.error('Erro ao carregar produtos:', err);
          setCarregando(false);
        });
    } else {
      navigate('/LoginComercio', { replace: true });
    }
  }, [navigate]);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const atualizarCampo = (campo, valor) => {
    setProdutoEdit((prev) => ({ ...prev, [campo]: campo === 'preco' ? parseFloat(valor) || 0 : valor }));
  };

  const salvarEdicao = async (id) => {
    try {
      const res = await axios.put(
        `https://manaus-conectada.onrender.com/api/produtos/${comercio.numero}/${id}`,
        produtoEdit
      );
      setProdutos((prev) => prev.map((p) => (p._id === id ? res.data.produto : p)));
      setProdutosEditaveis((prev) => prev.map((p) => (p._id === id ? res.data.produto : p)));
      setProdutoEdit(null);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      alert('Erro ao atualizar produto.');
    }
  };

  const removerProduto = async (id) => {
    try {
      const res = await axios.delete(`https://manaus-conectada.onrender.com/api/produtos/${comercio.numero}/${id}`);
      setProdutos(res.data.produtos);
      setProdutosEditaveis(res.data.produtos.map(p => ({ ...p })));
    } catch (err) {
      console.error('Erro ao remover produto:', err);
      alert('Erro ao remover produto.');
    }
  };

  const adicionarProduto = async () => {
    if (!novoProduto.nome.trim() || novoProduto.preco === '' || isNaN(Number(novoProduto.preco))) {
      alert('Preencha nome e preço válidos');
      return;
    }

    const produtoFinal = {
      nome: novoProduto.nome.trim(),
      preco: parseFloat(novoProduto.preco),
      categoria: novoProduto.categoria.trim(),
      imagem: novoProduto.imagem.trim(),
    };

    try {
      const res = await axios.post(
        `https://manaus-conectada.onrender.com/api/produtos/${comercio.numero}`,
        produtoFinal
      );
      setProdutos(res.data.produtos);
      setProdutosEditaveis(res.data.produtos.map(p => ({ ...p })));
      setNovoProduto({ nome: '', preco: '', categoria: '', imagem: '' });
      setAbrirNovoProduto(false);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
      alert('Erro ao adicionar produto.');
    }
  };

  const sairLogin = () => {
    localStorage.removeItem('comercioLogado');
    setConfirmSairOpen(false);
    navigate('/LoginComercio', { replace: true });
  };

  const categoriasDisponiveis = [...new Set(produtos.map((p) => p.categoria).filter(Boolean))];
  const produtosFiltrados = produtosEditaveis.filter(p => {
    const categoriaOk = categoriaFiltro ? p.categoria === categoriaFiltro : true;
    const nomeOk = buscaNome ? p.nome.toLowerCase().includes(buscaNome.toLowerCase()) : true;
    return categoriaOk && nomeOk;
  });

  if (carregando) {
    return (
      <Container sx={{ mt: 6 }}>
        <Typography align="center" variant="h6">Carregando dados do comércio...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar
          src={comercio.logo || ''}
          alt={comercio.nome}
          sx={{ width: 120, height: 120, margin: 'auto', mb: 2, border: '3px solid #d92f27' }}
        />
        <Typography variant="h4" fontWeight="700">{comercio.nome}</Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setConfirmSairOpen(true)}
          sx={{ mt: 1, borderRadius: 3 }}
        >
          Sair
        </Button>
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Filtrar por Categoria</InputLabel>
        <Select
          value={categoriaFiltro}
          label="Filtrar por Categoria"
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          <MenuItem value="">Todas as Categorias</MenuItem>
          {categoriasDisponiveis.map((cat, idx) => (
            <MenuItem key={idx} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Buscar por Nome"
        variant="outlined"
        value={buscaNome}
        onChange={(e) => setBuscaNome(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography variant="h6" fontWeight="600" mb={2}>Produtos Cadastrados</Typography>

      {produtosFiltrados.length === 0 ? (
        <Typography>Nenhum produto encontrado com esses filtros.</Typography>
      ) : (
        produtosFiltrados.map((prod) => (
          <Card key={prod._id} sx={{ display: 'flex', mb: 2, borderRadius: 3, p: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight="bold">{prod.nome}</Typography>
              <Typography color="text.secondary">R$ {prod.preco.toFixed(2)}</Typography>
              <Typography variant="caption" color="text.secondary">{prod.categoria}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Button variant="outlined" size="small" onClick={() => setProdutoEdit(prod)}>Editar</Button>
              <IconButton color="error" onClick={() => removerProduto(prod._id)}><DeleteIcon /></IconButton>
            </Box>
          </Card>
        ))
      )}

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 80, right: 24, bgcolor: '#d92f27' }}
        onClick={() => setAbrirNovoProduto(true)}
      >
        <AddIcon />
      </Fab>

      <Button variant="text" onClick={() => navigate('/')}>Voltar para a página inicial</Button>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>Operação realizada com sucesso!</Alert>
      </Snackbar>

      <Dialog open={confirmSairOpen} onClose={() => setConfirmSairOpen(false)}>
        <DialogTitle>Deseja realmente sair do login?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmSairOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={sairLogin}>Sair</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(produtoEdit)} onClose={() => setProdutoEdit(null)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Produto</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Nome" fullWidth value={produtoEdit?.nome || ''} onChange={(e) => atualizarCampo('nome', e.target.value)} />
            <TextField label="Preço" type="number" inputProps={{ step: '0.01' }} fullWidth value={produtoEdit?.preco || ''} onChange={(e) => atualizarCampo('preco', e.target.value)} />
            <TextField label="Categoria" fullWidth value={produtoEdit?.categoria || ''} onChange={(e) => atualizarCampo('categoria', e.target.value)} />
            <TextField label="URL da Imagem" fullWidth value={produtoEdit?.imagem || ''} onChange={(e) => atualizarCampo('imagem', e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProdutoEdit(null)}>Cancelar</Button>
          <Button variant="contained" sx={{ bgcolor: '#d92f27' }} onClick={() => salvarEdicao(produtoEdit._id)}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={abrirNovoProduto} onClose={() => setAbrirNovoProduto(false)} fullWidth maxWidth="sm">
        <DialogTitle>Adicionar Novo Produto</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Nome" fullWidth value={novoProduto.nome} onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })} />
            <TextField label="Preço" type="number" inputProps={{ step: '0.01' }} fullWidth value={novoProduto.preco} onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })} />
            <TextField label="Categoria" fullWidth value={novoProduto.categoria} onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })} />
            <TextField label="URL da Imagem" fullWidth value={novoProduto.imagem} onChange={(e) => setNovoProduto({ ...novoProduto, imagem: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAbrirNovoProduto(false)}>Cancelar</Button>
          <Button variant="contained" sx={{ bgcolor: '#d92f27' }} onClick={adicionarProduto}>Adicionar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}