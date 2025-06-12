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
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem
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
  const [formaPagamento, setFormaPagamento] = useState("");
  

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

    if (!nomeRecebedor || !rua || !numeroCasa || !formaPagamento) {
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
    const pagamento = `Forma de pagamento: ${formaPagamento}`    
    const recebedor = `Receberá: ${nomeRecebedor}`;

    const texto = `Olá! Gostaria de fazer o pedido:\n${mensagem}\n\n${endereco}\n\n ${pagamento}\n\n${recebedor}\n\nTotal: R$ ${valorTotal.toFixed(2)}`;

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
          bgcolor: '#bbdefb',
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
          <Typography variant="h6" fontWeight="bold" color="blue">
            Meu Food
          </Typography>
          <Box>
            <IconButton onClick={() => setMostrarCarrinho(!mostrarCarrinho)}>
              <Badge badgeContent={cartItems.length} color="secondary">
                <ShoppingCartIcon sx={{ color: 'blue' }} />
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
              px: 2,
              py: 2,
            }}
          >
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,  // garante que fique acima dos cards
                bgcolor: '#bbdefb',
                px: 2,
                py: 1,
                borderRadius: 0, // sem borda arredondada para ficar mais clean no topo
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                WebkitOverflowScrolling: 'touch',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
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
                    minWidth: 'auto',
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    bgcolor: cat === categoriaSelecionada ? '#1976d2' : '#fff',
                    color: cat === categoriaSelecionada ? '#fff' : '#1976d2',
                    borderColor: '#1976d2',
                    boxShadow: cat === categoriaSelecionada
                      ? '0 4px 15px rgba(25, 118, 210, 0.3)'
                      : 'none',
                    marginRight: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: cat === categoriaSelecionada ? '#1565c0' : 'rgba(25, 118, 210, 0.1)',
                      color: cat === categoriaSelecionada ? '#fff' : '#1565c0',
                      borderColor: '#1565c0',
                      transform: 'scale(1.05)',
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.15)',
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                      boxShadow: 'none',
                      bgcolor: '#0d47a1',
                      borderColor: '#0d47a1',
                    },
                  }}
                >
                  {cat}
                </Button>
              ))}
            </Box>
          </Box>
        )}


        {/* Lista de Produtos */}
          {!mostrarCarrinho && (
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 0 } }}>
              <Grid container spacing={4} justifyContent="center">
                {produtos
                  .filter((p) => p.categoria === categoriaSelecionada)
                  .map((produto) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={produto.id}
                      sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <Card
                        sx={{
                          width: 320,
                          borderRadius: 12,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          bgcolor: '#fff',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-6px)',
                            boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                          },
                          padding: 3,
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1, px: 0, pt: 0, pb: 3 }}>
                          <Typography
                            variant="h6"
                            fontWeight="600"
                            color="#333"
                            sx={{ mb: 1 }}
                          >
                            {produto.nome}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="#4caf50"
                            fontWeight="700"
                            sx={{ fontSize: '1.4rem' }}
                          >
                            R$ {produto.preco.toFixed(2).replace('.', ',')}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ p: 0 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => adicionarAoCarrinho(produto)}
                            sx={{
                              bgcolor: 'blue',
                              color: '#fff',
                              fontWeight: '700',
                              borderRadius: 10,
                              textTransform: 'none',
                              boxShadow: '0 6px 15px rgba(255, 87, 34, 0.4)',
                              transition: 'all 0.3s ease',
                              py: 1.5,
                              fontSize: '1rem',
                              '&:hover': {
                                bgcolor: '#e64a19',
                                boxShadow: '0 8px 20px rgba(230, 74, 25, 0.6)',
                              },
                              '&:active': {
                                transform: 'scale(0.97)',
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
          )}

        {/* Carrinho */}
        {mostrarCarrinho && (
            <Box sx={{ mb: 3, px: { xs: 2, sm: 4 }, py: 3, bgcolor: '#f0f7ff', borderRadius: 3, boxShadow: '0 4px 20px rgba(21, 101, 192, 0.1)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="#1976d2">
                  Carrinho
                </Typography>
                <IconButton onClick={limparCarrinho} sx={{ color: '#1976d2' }} aria-label="Limpar carrinho">
                  <ClearAllIcon fontSize="medium" />
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2, borderColor: '#bbdefb' }} />

              {cartItems.length === 0 ? (
                <Typography sx={{ mt: 4, textAlign: 'center', color: '#555', fontStyle: 'italic' }}>
                  Seu carrinho está vazio.
                </Typography>
              ) : (
                <Box sx={{ mt: 1, maxHeight: '40vh', overflowY: 'auto', pr: 1 }}>
                  {cartItems.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        mb: 2,
                        pb: 1,
                        borderBottom: '1px solid #cfd8dc',
                        alignItems: 'center',
                      }}
                    >
                      {/* <Box
                        component="img"
                        src={item.imagem}
                        alt={item.nome}
                        sx={{ width: 64, height: 64, borderRadius: 2, objectFit: 'cover', boxShadow: '0 2px 8px rgba(21, 101, 192, 0.1)' }}
                      /> */}
                      <Box sx={{ ml: 2, flexGrow: 1 }}>
                        <Typography fontWeight="700" color="#1565c0" noWrap>
                          {item.nome}
                        </Typography>
                        <Typography variant="body2" color="#0d47a1">
                          R$ {(item.preco * item.quantidade).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          onClick={() => removerItem(item)}
                          sx={{ color: '#1976d2' }}
                          aria-label={`Remover um ${item.nome}`}
                        >
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                        <Typography sx={{ mx: 1, minWidth: 20, textAlign: 'center', fontWeight: '600' }}>
                          {item.quantidade}
                        </Typography>
                        <IconButton
                          onClick={() => aumentarQuantidade(item)}
                          sx={{ color: '#1976d2' }}
                          aria-label={`Adicionar um ${item.nome}`}
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              <Divider sx={{ mt: 2, mb: 3, borderColor: '#bbdefb' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography fontWeight="bold" color="#0d47a1" fontSize={18}>
                  Total:
                </Typography>
                <Typography fontWeight="bold" color="#0d47a1" fontSize={18}>
                  R$ {valorTotal.toFixed(2)}
                </Typography>
              </Box>

              {/* Informações de Entrega */}
              <Box sx={{ mt: 1 }}>
                <Typography variant="h6" fontWeight="bold" color="#1976d2" gutterBottom>
                  Informações de Entrega
                </Typography>

                <TextField
                  fullWidth
                  label="Nome de quem vai receber"
                  variant="outlined"
                  value={nomeRecebedor}
                  onChange={(e) => setNomeRecebedor(e.target.value)}
                  sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }}
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Rua"
                  variant="outlined"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }}
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Número da casa"
                  variant="outlined"
                  value={numeroCasa}
                  onChange={(e) => setNumeroCasa(e.target.value)}
                  sx={{ mb: 2, bgcolor: 'white', borderRadius: 1 }}
                  size="small"
                />

                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel id="pagamento-label">Forma de Pagamento</InputLabel>
                  <Select
                    labelId="pagamento-label"
                    id="pagamento-select"
                    value={formaPagamento}
                    label="Forma de Pagamento"
                    onChange={(e) => setFormaPagamento(e.target.value)}
                    size="small"
                    sx={{ bgcolor: 'white', borderRadius: 1 }}
                  >
                    <MenuItem value="pix">Pix</MenuItem>
                    <MenuItem value="dinheiro">Dinheiro</MenuItem>
                    <MenuItem value="debito">Débito</MenuItem>
                    <MenuItem value="credito">Crédito</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={finalizarPedido}
                disabled={cartItems.length === 0 || loading}
                sx={{
                  mt: 4,
                  bgcolor: '#1976d2',
                  color: 'white',
                  fontWeight: '700',
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: '0 6px 15px rgba(25, 118, 210, 0.6)',
                  '&:hover': {
                    bgcolor: '#1565c0',
                    boxShadow: '0 8px 20px rgba(21, 101, 192, 0.8)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Finalizar Pedido'}
              </Button>
            </Box>
          )}

        {/* Snackbar */}
        {snackbarOpen && (
  <Alert
    severity="success"
    onClose={() => setSnackbarOpen(false)}
    sx={{
      width: '100%',
      bgcolor: '#4caf50',
      color: 'white',
      position: 'sticky',
      bottom: 0,
      zIndex: 1300, // valor alto para ficar acima
    }}
  >
    Produto adicionado ao carrinho!
  </Alert>
)}


      </Box>
    </Modal>
  );
}