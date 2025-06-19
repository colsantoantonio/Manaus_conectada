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
  Box,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditorProdutos() {
  const navigate = useNavigate();

  const [comercio, setComercio] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [produtosEditaveis, setProdutosEditaveis] = useState([]); // para edição local
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    preco: '',
    categoria: '',
    imagem: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [confirmSairOpen, setConfirmSairOpen] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const comercioString = localStorage.getItem('comercioLogado');
    if (comercioString) {
      const comercioObj = JSON.parse(comercioString);
      setComercio(comercioObj);

      axios
        .get(`https://manaus-conectada.onrender.com/api/produtos/${comercioObj.numero}`)
        .then((res) => {
          setProdutos(res.data);
          setProdutosEditaveis(res.data.map(p => ({ ...p }))); // cópia para edição
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
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
      alert('Erro ao adicionar produto.');
    }
  };

  // Atualiza localmente o produto editável (não salva no servidor ainda)
  const editarLocalmente = (id, campo, valor) => {
    setProdutosEditaveis((prev) =>
      prev.map((p) => (p._id === id ? { ...p, [campo]: campo === 'preco' ? (parseFloat(valor) || 0) : valor } : p))
    );
  };

  // Envia atualização para o servidor e atualiza estados
  const salvarEdicao = async (id) => {
    const produtoEditado = produtosEditaveis.find((p) => p._id === id);
    if (!produtoEditado) return;

    try {
      const res = await axios.put(
        `https://manaus-conectada.onrender.com/api/produtos/${comercio.numero}/${id}`,
        {
          nome: produtoEditado.nome,
          preco: produtoEditado.preco,
          categoria: produtoEditado.categoria,
          imagem: produtoEditado.imagem,
        }
      );
      // Atualiza produtos com resposta do servidor
      setProdutos((prev) =>
        prev.map((p) => (p._id === id ? res.data.produto : p))
      );
      setProdutosEditaveis((prev) =>
        prev.map((p) => (p._id === id ? res.data.produto : p))
      );
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      alert('Erro ao atualizar produto.');
    }
  };

  const removerProduto = async (id) => {
    try {
      const res = await axios.delete(
        `https://manaus-conectada.onrender.com/api/produtos/${comercio.numero}/${id}`
      );
      setProdutos(res.data.produtos);
      setProdutosEditaveis(res.data.produtos.map(p => ({ ...p })));
    } catch (err) {
      console.error('Erro ao remover produto:', err);
      alert('Erro ao remover produto.');
    }
  };

  const sairLogin = () => {
    localStorage.removeItem('comercioLogado');
    setConfirmSairOpen(false);
    navigate('/LoginComercio', { replace: true });
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  if (carregando) {
    return (
      <Container sx={{ mt: 6 }}>
        <Typography align="center" variant="h6">
          Carregando dados do comércio...
        </Typography>
      </Container>
    );
  }

  if (!comercio) {
    return (
      <Container sx={{ mt: 6 }}>
        <Typography align="center" variant="h6" color="error">
          Comércio não encontrado. Redirecionando para login...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 8 }}>
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
          p: 2,
          bgcolor: '#fff',
          borderRadius: 3,
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        }}
      >
        <Avatar
          src={comercio.logo || ''}
          alt={comercio.nome}
          sx={{
            width: 120,
            height: 120,
            margin: 'auto',
            mb: 2,
            border: '3px solid #d92f27',
            boxShadow: '0 0 10px rgba(217, 47, 39, 0.5)',
          }}
        />
        <Typography variant="h4" fontWeight="700" gutterBottom>
          {comercio.nome}
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setConfirmSairOpen(true)}
          sx={{
            mt: 1,
            borderRadius: 3,
            px: 3,
            fontWeight: 'bold',
            textTransform: 'none',
            fontSize: '1rem',
          }}
        >
          Sair
        </Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3, mb: 6, bgcolor: '#fff' }}>
        <Typography variant="h6" gutterBottom fontWeight="600">
          Adicionar Novo Produto
        </Typography>

        <Stack spacing={2} mb={2}>
          <TextField
            label="Nome"
            fullWidth
            value={novoProduto.nome}
            onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
          />
          <TextField
            label="Preço"
            fullWidth
            type="number"
            inputProps={{ step: '0.01' }}
            value={novoProduto.preco}
            onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })}
          />
          <TextField
            label="Categoria"
            fullWidth
            value={novoProduto.categoria}
            onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
          />
          <TextField
            label="URL da Imagem"
            fullWidth
            value={novoProduto.imagem}
            onChange={(e) => setNovoProduto({ ...novoProduto, imagem: e.target.value })}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={adicionarProduto}
            sx={{ mt: 1, bgcolor: '#d92f27', fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            Adicionar
          </Button>
        </Stack>
      </Paper>

      <Typography variant="h6" fontWeight="600" mb={2}>
        Produtos Cadastrados
      </Typography>

      {produtosEditaveis.length === 0 ? (
        <Typography>Nenhum produto adicionado ainda.</Typography>
      ) : (
        produtosEditaveis.map((prod) => (
          <Paper
            key={prod._id}
            sx={{
              p: 2,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 3,
              boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
              bgcolor: '#fff',
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                label="Nome"
                variant="standard"
                value={prod.nome}
                onChange={(e) => editarLocalmente(prod._id, 'nome', e.target.value)}
                sx={{ mb: 1, mr: 1 }}
              />
              <TextField
                label="Preço"
                variant="standard"
                type="number"
                inputProps={{ step: '0.01' }}
                value={prod.preco}
                onChange={(e) => editarLocalmente(prod._id, 'preco', e.target.value)}
                sx={{ mb: 1, mr: 1, width: '120px' }}
              />
              <TextField
                label="Categoria"
                variant="standard"
                value={prod.categoria}
                onChange={(e) => editarLocalmente(prod._id, 'categoria', e.target.value)}
                sx={{ mb: 1, mr: 1 }}
              />
              <TextField
                label="URL da Imagem"
                variant="standard"
                value={prod.imagem}
                onChange={(e) => editarLocalmente(prod._id, 'imagem', e.target.value)}
                sx={{ mb: 1 }}
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => salvarEdicao(prod._id)}
                sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
              >
                Salvar
              </Button>

              <IconButton color="error" onClick={() => removerProduto(prod._id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))
      )}

      <Button variant="text" onClick={() => navigate('/')}>
        Voltar para a página inicial
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Operação realizada com sucesso!
        </Alert>
      </Snackbar>

      <Dialog open={confirmSairOpen} onClose={() => setConfirmSairOpen(false)}>
        <DialogTitle>Deseja realmente sair do login?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmSairOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={sairLogin}>
            Sair
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
