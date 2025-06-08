import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardHeader,
  Avatar,
  Button,
  Stack,
  TextField,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Collapse,
  CardMedia,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import StoreIcon from "@mui/icons-material/Store";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import dadosComercios from "./comercios.json";
import PanfletoModal from '../../Components/PanfletoModal/PanfletoModal';
import LoginIcon from '@mui/icons-material/Login';

function Comercio() {
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [filtro, setFiltro] = useState(null);
  const [abertos, setAbertos] = useState({});
  const [comercioSelecionado, setComercioSelecionado] = useState(null);
  

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const openWhatsApp = (numero, nome) => {
    const mensagem = `Olá! Gostaria de saber mais sobre os serviços do ${nome}.`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  const abrirModalComercio = (comercio) => {
  setComercioSelecionado(comercio);
  setModalAberto(true);
};


  const fecharModalImagem = () => {
    setComercioSelecionado(null);
    setModalAberto(false);
  };

  const categorias = {
    mercadinhos: dadosComercios.mercadinhos || [],
    lanchonetes: dadosComercios.lanchonetes || [],
    farmacias: dadosComercios.farmacias || [],
    saloes: dadosComercios.saloes || [],
    igrejas: dadosComercios.igrejas || [],
    escolas: dadosComercios.escolas || [],
  };

  const todosComercios = Object.values(categorias).flat();
  const comerciosFiltrados = todosComercios.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const tituloCategoria = {
    mercadinhos: "🛒 Mercadinhos",
    lanchonetes: "🍔 Lanchonetes",
    farmacias: "💊 Farmácias",
    saloes: "✂️ Salões de Beleza",
    igrejas: "⛪ Igrejas",
    escolas: "🏫 Escolas",
  };

   const irParaLogin = () => {
    window.location.href = '/LoginComercio'; // ou usar react-router se tiver
  };

  const toggleCategoria = (cat) => {
    setAbertos((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const renderCategoriaComBotao = (chave, lista) => (
    <div key={chave} style={{ marginBottom: "2rem" }}>
       <Stack
          direction="row"
          justifyContent="center"
          mb={2}
          px={2}
        >
          <Button
            variant="contained"
            onClick={() => toggleCategoria(chave)}
            sx={{
              width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
              textAlign: "left",
              justifyContent: "flex-start",
              py: 1.5,
            }}
          >
            {tituloCategoria[chave]}
          </Button>
        </Stack>
      <Collapse in={abertos[chave] || false} timeout="auto" unmountOnExit>
        <Grid container spacing={3} justifyContent="center" mt={2}>
          {lista.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
           <Card
                  sx={{
                    width: 300,
                    height: 445,
                    borderRadius: 3,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    p: 2,
                    backgroundColor: "#fff",
                    overflow: "hidden",
                  }}
                >
                  {/* Imagem no topo */}
                 {item.logo && (
                  <CardMedia
                    component="img"
                    height="100"
                    image={item.logo}
                    alt={`${item.nome} logo`}
                    sx={{ borderRadius: 2, mb: 1 }}
                  />
                )}

                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#25D366" }}>
                        <StoreIcon />
                      </Avatar>
                    }
                    title={
                      <Typography
                        variant="h6"
                        noWrap
                        sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
                        title={item.nome}
                      >
                        {item.nome}
                      </Typography>
                    }
                    subheader="Comércio local"
                    sx={{ pb: 1 }}
                  />

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      overflowY: "auto",
                      paddingRight: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} /> {item.numero}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} /> {item.horario}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <LocalShippingIcon fontSize="small" sx={{ mr: 0.5 }} /> {item.entrega}
                    </Typography>
                    {item.localizacao && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ cursor: "pointer", textDecoration: "underline" }}
                        onClick={() => window.open(item.localizacao, "_blank")}
                      >
                        <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Localização
                      </Typography>
                    )}
                  </CardContent>

                  <Stack spacing={1} mt={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<WhatsAppIcon />}
                      sx={{ height: 40 }}
                      onClick={() => openWhatsApp(item.numero, item.nome)}
                    >
                      WhatsApp
                    </Button>
                  {item.panfleto && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      sx={{ height: 40 }}
                      onClick={() => abrirModalComercio(item)} // <-- passar o item inteiro
                    >
                      Fazer pedido
                    </Button>
                  )}
                  </Stack>
                </Card>
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </div>
  );

  return (
    <div style={{ padding: "2rem 1rem", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          mb: 4,
          fontSize: { xs: "1.3rem", sm: "2rem", md: "2.5rem" },
          maxWidth: "900px",
          margin: "0 auto",
          px: 2,
        }}
      >
        🏘️ Guia de Comércios do Bairro!
      </Typography>

      {/* Filtros */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        mb={2}
        marginTop="25px"
      >
      </Stack>

      {/* Lista */}
      {busca.trim() ? (
        renderCategoriaComBotao("Busca", comerciosFiltrados)
      ) : filtro ? (
        renderCategoriaComBotao(filtro, categorias[filtro])
      ) : (
        Object.entries(categorias).map(([chave, lista]) =>
          renderCategoriaComBotao(chave, lista)
        )
      )}

      {/*<Button variant="contained" onClick={() => setModalAberto(true)}>
        Ver Panfleto
      </Button> */}

      <Stack
      direction="column"
      spacing={1}
      alignItems="center"
      justifyContent="center"
      mb={3}
      sx={{
        maxWidth: 300,
        mx: 'auto',
        p: 2,
        borderRadius: 2,
        backgroundColor: '#f5f5f5',
        boxShadow: 1,
      }}
    >
      <Typography
        variant="body2"
        align="center"
        sx={{ color: '#666', fontStyle: 'italic', mb: 1 }}
      >
        Área exclusiva para Comercios cadastrados.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<LoginIcon />}
        onClick={irParaLogin}
        sx={{
          bgcolor: 'rgba(25, 67, 184, 0.4)', // vermelho iFood
          '&:hover': {
            bgcolor: '#b52722',
          },
          fontWeight: 'bold',
         fontSize: '0.95rem',     // menor que 1.1rem
          paddingX: 2.2,           // menor que 3
          paddingY: 0.9,           // menor que 1.2
          borderRadius: 2,         // ligeiramente menor
                textTransform: 'none',
          boxShadow: '0 4px 10px rgba(39, 87, 217, 0.4)',
          width: '100%',
        }}
      >
        Área do comércio
      </Button>
    </Stack>
       
    <PanfletoModal
  open={modalAberto}
  onClose={() => setModalAberto(false)}
  comercio={comercioSelecionado} // <-- passa o comércio selecionado aqui
/>

    </div>
  );
}

export default Comercio;