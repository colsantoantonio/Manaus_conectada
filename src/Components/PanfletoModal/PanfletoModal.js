import React, { useState } from 'react';
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

const categorias = ['Hambúrguer', 'Pizza', 'Bebidas'];

const produtos = [
  {
    id: 1,
    nome: 'Hambúrguer Clássico',
    preco: 25.0,
    categoria: 'Hambúrguer',
    imagem: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    nome: 'Pizza Margherita',
    preco: 40.0,
    categoria: 'Pizza',
    imagem: 'https://images.unsplash.com/photo-1548365328-6b14788ca710?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    nome: 'Coca-Cola 500ml',
    preco: 7.0,
    categoria: 'Bebidas',
    imagem: 'https://images.unsplash.com/photo-1582719478147-56c69d0df86d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    nome: 'Cheeseburguer',
    preco: 30.0,
    categoria: 'Hambúrguer',
    imagem: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    nome: 'Pizza Pepperoni',
    preco: 45.0,
    categoria: 'Pizza',
    imagem: 'https://images.unsplash.com/photo-1594007657608-31f4acb2b0bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    nome: 'Suco de Laranja',
    preco: 8.0,
    categoria: 'Bebidas',
    imagem: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
  },
];

export default function PanfletoModal({ open, onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(categorias[0]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const [nomeRecebedor, setNomeRecebedor] = useState('');
const [rua, setRua] = useState('');
const [numeroCasa, setNumeroCasa] = useState('');

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

  const telefone = '5592993847070';
  const urlWhatsApp = `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;

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
              position: 'sticky',
              top: 0,
              zIndex: 10,
              bgcolor: 'white',
              py: 1.5,
              mb: 3,
              boxShadow: '0 2px 6px rgba(234,29,44,0.3)',
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{ overflowX: 'auto', px: 1, justifyContent: 'center' }}
            >
              {categorias.map((cat) => (
                <Button
                  key={cat}
                  variant={cat === categoriaSelecionada ? 'contained' : 'outlined'}
                  onClick={() => setCategoriaSelecionada(cat)}
                  sx={{
                    borderRadius: 25,
                    textTransform: 'none',
                    px: 4,
                    py: 1.2,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    bgcolor: cat === categoriaSelecionada ? '#53aaf9' : 'transparent',
                    color: cat === categoriaSelecionada ? 'white' : '#53aaf9',
                    borderColor: '#53aaf9',
                    flexShrink: 0,
                    minWidth: 90,
                  }}
                >
                  {cat}
                </Button>
              ))}
            </Stack>
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