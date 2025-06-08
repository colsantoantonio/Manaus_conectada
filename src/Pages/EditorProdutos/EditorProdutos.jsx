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
  console.log('🚀 EditorProdutos renderizado');

  const navigate = useNavigate();

  const [comercio, setComercio] = useState(null);
  const [produtos, setProdutos] = useState([]);
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
  console.log('🟡 Início do useEffect do PainelComercio');

  const comercioString = localStorage.getItem('comercioLogado');
  console.log('📦 localStorage.getItem:', comercioString);

  if (comercioString) {
    try {
      const comercioObj = JSON.parse(comercioString);
      console.log('✅ Objeto parseado com sucesso:', comercioObj);

      if (!comercioObj.imagem && comercioObj.logo) {
        console.log('📷 "imagem" não existia, usando logo:', comercioObj.logo);
        comercioObj.imagem = comercioObj.logo;
      }

      setComercio(comercioObj);
      console.log('📌 setComercio foi chamado');

      const numero = comercioObj.numero;
      const produtosSalvos = localStorage.getItem(`produtos-${numero}`);
      console.log(`📦 Produtos salvos para o número ${numero}:`, produtosSalvos);

      if (!produtosSalvos || produtosSalvos === '[]') {
        console.log('🆕 Produtos vazios. Salvando do objeto do comércio.');
        setProdutos(comercioObj.produtos || []);
        localStorage.setItem(`produtos-${numero}`, JSON.stringify(comercioObj.produtos || []));
      } else {
        console.log('📦 Produtos encontrados no localStorage. Carregando...');
        setProdutos(JSON.parse(produtosSalvos));
      }

      setCarregando(false);
      console.log('✅ Carregamento concluído');

    } catch (erro) {
      console.error('❌ Erro ao parsear o JSON ou carregar dados:', erro);
      navigate('/LoginComercio', { replace: true });
    }
  } else {
    console.warn('⚠️ Nenhum comércio encontrado no localStorage');
    setTimeout(() => {
      navigate('/LoginComercio', { replace: true });
    }, 1000);
  }
}, [navigate]);


  useEffect(() => {
    if (comercio) {
      localStorage.setItem(`produtos-${comercio.numero}`, JSON.stringify(produtos));
    }
  }, [produtos, comercio]);

  const adicionarProduto = () => {
    if (!novoProduto.nome.trim() || novoProduto.preco === '' || isNaN(Number(novoProduto.preco))) {
      alert('Preencha nome e preço válidos');
      return;
    }

    const novo = {
      id: Date.now(),
      nome: novoProduto.nome.trim(),
      preco: parseFloat(novoProduto.preco),
      categoria: novoProduto.categoria.trim(),
      imagem: novoProduto.imagem.trim(),
    };

    setProdutos((prev) => [...prev, novo]);
    setNovoProduto({ nome: '', preco: '', categoria: '', imagem: '' });
    setSnackbarOpen(true);
  };

  const removerProduto = (id) => {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  };

  const atualizarProduto = (id, campo, valor) => {
    setProdutos((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          if (campo === 'preco') {
            if (valor === '') {
              return { ...p, preco: '' };
            }
            const num = parseFloat(valor);
            if (isNaN(num)) return p;
            return { ...p, preco: num };
          }
          return { ...p, [campo]: valor };
        }
        return p;
      })
    );
  };

  const abrirConfirmSair = () => setConfirmSairOpen(true);
  const fecharConfirmSair = () => setConfirmSairOpen(false);

  const sairLogin = () => {
    document.activeElement?.blur();
    localStorage.removeItem('comercioLogado');
    setConfirmSairOpen(false);
    navigate('/LoginComercio', { replace: true });
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // 🔄 Exibe "Carregando..." enquanto tenta ler o localStorage
  if (carregando) {
    return (
      <Container sx={{ mt: 6 }}>
        <Typography align="center" variant="h6">
          Carregando dados do comércio...
        </Typography>
      </Container>
    );
  }

  // ❌ Não encontrou o comércio, já está redirecionando
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
        {comercio.imagem ? (
          <Avatar
            src={comercio.imagem}
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
        ) : (
          <Avatar
            sx={{
              width: 120,
              height: 120,
              margin: 'auto',
              mb: 2,
              bgcolor: '#d92f27',
              fontSize: 48,
              fontWeight: 'bold',
            }}
          >
            {comercio.nome[0].toUpperCase()}
          </Avatar>
        )}
        <Typography variant="h4" fontWeight="700" gutterBottom>
          {comercio.nome}
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={abrirConfirmSair}
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

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 6,
          bgcolor: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight="600">
          Adicionar Novo Produto
        </Typography>

        <Stack spacing={2} mb={2}>
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            value={novoProduto.nome}
            onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
          />
          <TextField
            label="Preço"
            variant="outlined"
            fullWidth
            type="number"
            inputProps={{ step: '0.01' }}
            value={novoProduto.preco}
            onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })}
          />
          <TextField
            label="Categoria"
            variant="outlined"
            fullWidth
            value={novoProduto.categoria}
            onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
          />
          <TextField
            label="URL da Imagem"
            variant="outlined"
            fullWidth
            value={novoProduto.imagem}
            onChange={(e) => setNovoProduto({ ...novoProduto, imagem: e.target.value })}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={adicionarProduto}
            sx={{
              mt: 1,
              bgcolor: '#d92f27',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: '#b52722',
              },
            }}
          >
            Adicionar
          </Button>
        </Stack>
      </Paper>

      <Typography variant="h6" fontWeight="600" mb={2}>
        Produtos Cadastrados
      </Typography>

      {produtos.length === 0 ? (
        <Typography>Nenhum produto adicionado ainda.</Typography>
      ) : (
        produtos.map((prod) => (
          <Paper
            key={prod.id}
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 3,
              boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
              bgcolor: '#fff',
              transition: 'transform 0.15s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
              },
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                label="Nome"
                variant="standard"
                value={prod.nome}
                onChange={(e) => atualizarProduto(prod.id, 'nome', e.target.value)}
                sx={{ mb: 1, mr: 1 }}
              />
              <TextField
                label="Preço"
                variant="standard"
                type="number"
                inputProps={{ step: '0.01' }}
                value={prod.preco === '' ? '' : prod.preco}
                onChange={(e) => atualizarProduto(prod.id, 'preco', e.target.value)}
                sx={{ mb: 1, mr: 1, width: '120px' }}
              />
              <TextField
                label="Categoria"
                variant="standard"
                value={prod.categoria}
                onChange={(e) => atualizarProduto(prod.id, 'categoria', e.target.value)}
                sx={{ mb: 1, mr: 1 }}
              />
              <TextField
                label="URL da Imagem"
                variant="standard"
                value={prod.imagem}
                onChange={(e) => atualizarProduto(prod.id, 'imagem', e.target.value)}
                sx={{ mb: 1 }}
                fullWidth
              />
            </Box>
            <IconButton
              color="error"
              onClick={() => removerProduto(prod.id)}
              aria-label="remover"
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Paper>
        ))
      )}

      <Button
        variant="text"
        onClick={() => navigate('/')}
        sx={{ mt: 4, fontWeight: 'bold' }}
      >
        Voltar para a página inicial
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Produto adicionado com sucesso!
        </Alert>
      </Snackbar>

      <Dialog open={confirmSairOpen} onClose={fecharConfirmSair}>
        <DialogTitle>Deseja realmente sair do login?</DialogTitle>
        <DialogActions>
          <Button onClick={fecharConfirmSair} color="primary">
            Cancelar
          </Button>
          <Button onClick={sairLogin} color="error" variant="contained" autoFocus>
            Sair
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
