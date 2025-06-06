import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Drawer,
  Box,
  IconButton,
  Divider,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  Badge,
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Mock de categorias e produtos
const categorias = ['Hambúrguer', 'Pizza', 'Bebidas'];

const produtos = [
  {
    id: 1,
    nome: 'Hambúrguer Clássico',
    preco: 25.0,
    categoria: 'Hambúrguer',
    imagem:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    nome: 'Pizza Margherita',
    preco: 40.0,
    categoria: 'Pizza',
    imagem:
      'https://images.unsplash.com/photo-1548365328-6b14788ca710?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    nome: 'Coca-Cola 500ml',
    preco: 7.0,
    categoria: 'Bebidas',
    imagem:
      'https://images.unsplash.com/photo-1582719478147-56c69d0df86d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    nome: 'Cheeseburguer',
    preco: 30.0,
    categoria: 'Hambúrguer',
    imagem:
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    nome: 'Pizza Pepperoni',
    preco: 45.0,
    categoria: 'Pizza',
    imagem:
      'https://images.unsplash.com/photo-1594007657608-31f4acb2b0bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    nome: 'Suco de Laranja',
    preco: 8.0,
    categoria: 'Bebidas',
    imagem:
      'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
  },
];

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(categorias[0]);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

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
    setLoading(true);

    const mensagem = cartItems
      .map(
        (item) =>
          `${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}`
      )
      .join('\n');

    const telefone = '5599999999999';
    const urlWhatsApp = `https://wa.me/${telefone}?text=${encodeURIComponent(
      `Olá! Gostaria de fazer o pedido:\n${mensagem}\nTotal: R$ ${valorTotal.toFixed(2)}`
    )}`;

    setLoading(false);
    window.open(urlWhatsApp, '_blank');
  };

  return (
    <>
      {/* Topo fixo */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          width: '100%',
          bgcolor: '#ea1d2c',
          color: 'white',
          zIndex: 1300,
          p: { xs: 1, sm: 1.5 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', ml: { xs: 1, sm: 2 }, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
        >
          Meu Food
        </Typography>
        <IconButton
          color="inherit"
          onClick={toggleDrawer}
          size="large"
          aria-label="Abrir carrinho"
          sx={{ mr: { xs: 1, sm: 2 } }}
        >
          <Badge badgeContent={cartItems.length} color="secondary">
            <ShoppingCartIcon fontSize="large" />
          </Badge>
        </IconButton>
      </Box>

      {/* Espaço para compensar topo fixo */}
      <Box sx={{ height: { xs: 96, sm: 74 } }} />

      <Container maxWidth="sm" sx={{ mb: 6 }}>
        {/* Categorias */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 3, overflowX: 'auto', pb: 1, px: 1 }}
        >
          {categorias.map((cat) => (
            <Button
              key={cat}
              variant={cat === categoriaSelecionada ? 'contained' : 'outlined'}
              onClick={() => setCategoriaSelecionada(cat)}
              sx={{
                borderRadius: 20,
                textTransform: 'none',
                px: 3,
                bgcolor: cat === categoriaSelecionada ? '#ea1d2c' : 'transparent',
                color: cat === categoriaSelecionada ? 'white' : '#ea1d2c',
                borderColor: '#ea1d2c',
                fontWeight: 'bold',
                flexShrink: 0,
                minWidth: 'auto',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                '&:hover': {
                  bgcolor: cat === categoriaSelecionada ? '#b41620' : '#f5f5f5',
                  color: cat === categoriaSelecionada ? 'white' : '#ea1d2c',
                },
              }}
            >
              {cat}
            </Button>
          ))}
        </Stack>

        {/* Produtos filtrados */}
        <Grid container spacing={2}>
          {produtos
            .filter((p) => p.categoria === categoriaSelecionada)
            .map((produto) => (
              <Grid item xs={12} sm={6} key={produto.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow:
                      '0 3px 8px rgba(234,29,44,0.3), 0 0 0 1px rgba(234,29,44,0.15)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow:
                        '0 5px 15px rgba(234,29,44,0.5), 0 0 0 1px rgba(234,29,44,0.2)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={produto.imagem}
                    alt={produto.nome}
                    height="140"
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: 'bold', color: '#ea1d2c' }}
                    >
                      {produto.nome}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      sx={{ fontWeight: 'bold' }}
                    >
                      R$ {produto.preco.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      onClick={() => adicionarAoCarrinho(produto)}
                      sx={{
                        bgcolor: '#ea1d2c',
                        color: 'white',
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: '#b41620',
                        },
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

      {/* Drawer carrinho */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: { xs: '80vw', sm: 400 },
            bgcolor: '#fff',
            p: 2,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="#ea1d2c">
            Carrinho
          </Typography>
          <IconButton onClick={limparCarrinho} aria-label="Limpar carrinho" size="large">
            <ClearAllIcon sx={{ color: '#ea1d2c' }} />
          </IconButton>
        </Box>

        <Divider />

        {cartItems.length === 0 ? (
          <Typography sx={{ mt: 4, textAlign: 'center' }}>
            Seu carrinho está vazio.
          </Typography>
        ) : (
          <Box sx={{ mt: 2, maxHeight: '60vh', overflowY: 'auto' }}>
            {cartItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  borderBottom: '1px solid #ddd',
                  pb: 1,
                }}
              >
                <img
                  src={item.imagem}
                  alt={item.nome}
                  width={64}
                  height={64}
                  style={{ borderRadius: 6, objectFit: 'cover' }}
                />
                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  <Typography fontWeight="bold" color="#ea1d2c">
                    {item.nome}
                  </Typography>
                  <Typography variant="body2">
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    onClick={() => removerItem(item)}
                    aria-label="Remover item"
                    size="small"
                    sx={{ color: '#ea1d2c' }}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  <Typography sx={{ mx: 1, minWidth: 20, textAlign: 'center' }}>
                    {item.quantidade}
                  </Typography>
                  <IconButton
                    onClick={() => aumentarQuantidade(item)}
                    aria-label="Adicionar item"
                    size="small"
                    sx={{ color: '#ea1d2c' }}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Divider sx={{ mt: 1, mb: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography fontWeight="bold">Total:</Typography>
          <Typography fontWeight="bold">R$ {valorTotal.toFixed(2)}</Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={finalizarPedido}
          disabled={cartItems.length === 0 || loading}
          sx={{
            bgcolor: '#ea1d2c',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: '#b41620',
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Finalizar Pedido'}
        </Button>
      </Drawer>

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
    </>
  );
}
