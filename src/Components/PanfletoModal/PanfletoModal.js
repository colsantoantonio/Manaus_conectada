import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  Badge,
  Divider,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import comerciosData from '../Comercios/comercios.json'; 

export default function PanfletoModal({ open, onClose, comercio }) {
  const [cartItems, setCartItems] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const [nomeRecebedor, setNomeRecebedor] = useState('');
  const [rua, setRua] = useState('');
  const [numeroCasa, setNumeroCasa] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [whatsapp, setWhatsapp] = useState('');

 useEffect(() => {
  let comercioSelecionado = comercio;

  if (!comercioSelecionado) {
    const tipos = ['lanchonetes', 'mercadinhos', 'farmacias', 'saloes', 'igrejas', 'escolas'];
    for (const tipo of tipos) {
      const lista = comerciosData?.[tipo];
      if (Array.isArray(lista)) {
        const comercioComProdutos = lista.find(c => Array.isArray(c.produtos) && c.produtos.length > 0);
        if (comercioComProdutos) {
          comercioSelecionado = comercioComProdutos;
          console.log("Selecionado automaticamente:", comercioComProdutos.nome);
          break;
        }
      }
    }
  } else {
    console.log("Comércio recebido via prop:", comercioSelecionado.nome);
  }

  if (comercioSelecionado) {
    setWhatsapp(comercioSelecionado.numero || '');
    const produtos = comercioSelecionado.produtos || [];
    setProdutos(produtos);

    const cats = Array.from(new Set(produtos.map((p) => p.categoria)));
    setCategorias(cats);
    setCategoriaSelecionada(cats[0] || '');
  }
}, [comercio, comerciosData]);



  const adicionarAoCarrinho = (produto) => {
    setSnackbarOpen(true);
    setCartItems((prev) => {
      const existe = prev.find((item) => item.id === produto.id);
      return existe
        ? prev.map((item) =>
            item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
          )
        : [...prev, { ...produto, quantidade: 1 }];
    });
  };

  const aumentarQuantidade = (produto) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  };

  const removerItem = (produto) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade - 1 } : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  const limparCarrinho = () => setCartItems([]);

  const valorTotal = cartItems.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const finalizarPedido = () => {
    if (cartItems.length === 0) return;

    if (!nomeRecebedor || !rua || !numeroCasa) {
      alert('Preencha todas as informações de entrega antes de finalizar o pedido.');
      return;
    }

    setLoading(true);

    const mensagem = cartItems
      .map(
        (item) =>
          `${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}`
      )
      .join('\n');

    const endereco = `Endereço: Rua ${rua}, Nº ${numeroCasa}`;
    const recebedor = `Receberá: ${nomeRecebedor}`;

    const texto = `Olá! Gostaria de fazer o pedido:\n${mensagem}\n\n${endereco}\n${recebedor}\n\nTotal: R$ ${valorTotal.toFixed(2)}`;

    const urlWhatsApp = `https://wa.me/${whatsapp.replace('+', '')}?text=${encodeURIComponent(texto)}`;

    setLoading(false);
    window.open(urlWhatsApp, '_blank');
  };


  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="#53aaf9">
            Meu Food
          </Typography>
          <Box>
            <IconButton onClick={() => setMostrarCarrinho(!mostrarCarrinho)}>
              <Badge badgeContent={cartItems.length} color="secondary">
                <ShoppingCartIcon sx={{ color: '#53aaf9' }} />
              </Badge>
            </IconButton>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Menu de Categorias fixo e destacado */}
            {!mostrarCarrinho && (
                <Box
                sx={{
                  width: '100%',
                  minWidth: 600,
                }}
              >
                <Box
                   sx={{
                      width: '100%',
                      position: 'sticky',
                      top: 0,
                      zIndex: 15,
                      bgcolor: '#f9f9f9',
                      py: 1,
                      mb: 3,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      overflowX: 'auto',
                      px: 2,
                      pr: 4,
                      display: 'flex',
                      alignItems: 'center',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#1976d2 transparent',
                      scrollSnapType: 'x mandatory',
                      '&::-webkit-scrollbar': {
                        height: 6,
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#1976d2',
                        borderRadius: 3,
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent',
                      },
                    }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                      width: 'max-content',
                      minWidth: 600,
                      pr: 2,
                      justifyContent: { xs: 'flex-start', sm: 'center' },
                      alignItems: 'center',
                      flexWrap: 'nowrap',
                      scrollSnapAlign: 'start',
                    }}
                  >

                    {categorias.map((cat) => (
                      <Button
                        key={cat}
                        onClick={() => setCategoriaSelecionada(cat)}
                        variant={cat === categoriaSelecionada ? 'contained' : 'outlined'}
                        sx={{
                          borderRadius: 50,
                          textTransform: 'capitalize',
                          px: 3,
                          py: 1.2,
                          minWidth: 100,
                          fontWeight: 600,
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          bgcolor: cat === categoriaSelecionada ? '#1976d2' : 'transparent',
                          color: cat === categoriaSelecionada ? '#fff' : '#1976d2',
                          borderColor: '#1976d2',
                          boxShadow: cat === categoriaSelecionada ? '0 4px 12px rgba(25, 118, 210, 0.4)' : 'none',
                          transition: 'all 0.3s ease',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          '&:hover': {
                            bgcolor: cat === categoriaSelecionada ? '#1565c0' : 'rgba(25, 118, 210, 0.1)',
                            borderColor: '#1565c0',
                            color: cat === categoriaSelecionada ? '#fff' : '#1565c0',
                            boxShadow: cat === categoriaSelecionada ? '0 6px 18px rgba(21, 101, 192, 0.6)' : '0 0 8px rgba(25, 118, 210, 0.2)',
                            transform: 'scale(1.05)',
                          },
                          '&:active': {
                            transform: 'scale(0.95)',
                            boxShadow: 'none',
                            bgcolor: '#0d47a1',
                            borderColor: '#0d47a1',
                          },
                          '@media (max-width:480px)': {
                            minWidth: 80,
                            fontSize: '0.85rem',
                            px: 2,
                            py: 1,
                          },
                        }}
                      >
                        {cat}
                      </Button>
                    ))}
                  </Stack>
                </Box>
                  </Box>
              )}

        {/* Lista de Produtos */}
        {!mostrarCarrinho && (
          <Container maxWidth="lg" sx={{ px: 0 }}>
            <Grid container spacing={2} justifyContent="center">
              {produtos
                .filter((p) => p.categoria === categoriaSelecionada)
                .map((produto) => (
                  <Grid item xs={12} sm={8} md={4} key={produto.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card
                      sx={{
                        width: '100%',
                        maxWidth: 360,
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow:
                          '0 3px 8px rgba(234,29,44,0.3), 0 0 0 1px rgba(234,29,44,0.15)',
                        '&:hover': {
                          transform: 'scale(1.03)',
                          boxShadow:
                            '0 5px 15px rgba(234,29,44,0.5), 0 0 0 1px rgba(234,29,44,0.2)',
                        },
                        transition: 'transform 0.2s ease-in-out',
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={produto.imagem}
                        alt={produto.nome}
                        height="140"
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="bold" color="#ea1d2c">
                          {produto.nome}
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          R$ {produto.preco.toFixed(2)}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: 1 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => adicionarAoCarrinho(produto)}
                          sx={{
                            bgcolor: '#53aaf9',
                            color: 'white',
                            fontWeight: 'bold',
                            '&:hover': { bgcolor: '#53aaf9' },
                          }}
                        >
                          Adicionar ao carrinho
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Container>
        )}

        {/* Carrinho */}
        {mostrarCarrinho && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="#53aaf9">
                Carrinho
              </Typography>
              <IconButton onClick={limparCarrinho}>
                <ClearAllIcon sx={{ color: '#53aaf9' }} />
              </IconButton>
            </Box>
            <Divider />

            {cartItems.length === 0 ? (
              <Typography sx={{ mt: 4, textAlign: 'center' }}>Seu carrinho está vazio.</Typography>
            ) : (
              <Box sx={{ mt: 2, maxHeight: '40vh', overflowY: 'auto' }}>
                {cartItems.map((item) => (
                  <Box
                    key={item.id}
                    sx={{ display: 'flex', mb: 2, pb: 1, borderBottom: '1px solid #ddd' }}
                  >
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      width={64}
                      height={64}
                      style={{ borderRadius: 6 }}
                    />
                    <Box sx={{ ml: 2, flexGrow: 1 }}>
                      <Typography fontWeight="bold" color="#53aaf9">
                        {item.nome}
                      </Typography>
                      <Typography variant="body2">
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton onClick={() => removerItem(item)} sx={{ color: '#53aaf9' }}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      <Typography sx={{ mx: 1 }}>{item.quantidade}</Typography>
                      <IconButton onClick={() => aumentarQuantidade(item)} sx={{ color: '#53aaf9' }}>
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            <Divider sx={{ mt: 2, mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography fontWeight="bold">Total:</Typography>
              <Typography fontWeight="bold">R$ {valorTotal.toFixed(2)}</Typography>
            </Box>

            {/* Informações de Entrega */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="#53aaf9" gutterBottom>
                Informações de Entrega
              </Typography>

              <TextField
                fullWidth
                label="Nome de quem vai receber"
                variant="outlined"
                value={nomeRecebedor}
                onChange={(e) => setNomeRecebedor(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Rua"
                variant="outlined"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Número da casa"
                variant="outlined"
                value={numeroCasa}
                onChange={(e) => setNumeroCasa(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={finalizarPedido}
              disabled={cartItems.length === 0 || loading}
              sx={{
                bgcolor: '#53aaf9',
                color: 'white',
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#b41620' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Finalizar Pedido'}
            </Button>
          </Box>
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: '100%', bgcolor: '#4caf50', color: 'white' }}
          >
            Produto adicionado ao carrinho!
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
}