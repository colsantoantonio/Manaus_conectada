import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardHeader,
  Avatar,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Collapse,
  CardMedia,
  Rating,
  Box,
  Modal,
  TextField
} from "@mui/material";
import axios from "axios";
import StoreIcon from "@mui/icons-material/Store";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PanfletoModal from '../../Components/PanfletoModal/PanfletoModal';
import LoginIcon from '@mui/icons-material/Login';

function Comercio() {
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [filtro, setFiltro] = useState(null);
  const [abertos, setAbertos] = useState({});
  const [comercioSelecionado, setComercioSelecionado] = useState(null);
  const [categorias, setCategorias] = useState({});
   const [avaliacaoModalAberto, setAvaliacaoModalAberto] = useState(false);
  const [avaliarItem, setAvaliarItem] = useState(null);
  const [nota, setNota] = useState(0);


  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const openWhatsApp = (numero, nome) => {
    const mensagem = `Olá! Gostaria de saber mais sobre os serviços do ${nome}.`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    const fetchComercios = async () => {
      try {
        const response = await axios.get("https://manaus-conectada.onrender.com/api/estabelecimentos");

        if (Array.isArray(response.data)) {
          const agrupado = response.data.reduce((acc, comercio) => {
            const tipo = comercio.categoriaTipo || "outros";
            if (!acc[tipo]) acc[tipo] = [];
            acc[tipo].push(comercio);
            return acc;
          }, {});

          for (let categoria in agrupado) {
            agrupado[categoria].sort((a, b) => (b.rating || 0) - (a.rating || 0));
          }

          setCategorias(agrupado);
        } else {
          console.error("Formato inesperado dos dados:", response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar estabelecimentos:", error);
      }
    };

    fetchComercios();
  }, []);

  const todosComercios = Object.values(categorias).flat();
  const comerciosFiltrados = todosComercios.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirModalComercio = (comercio) => {
    setComercioSelecionado(comercio);
    setModalAberto(true);
  };

  const fecharModalImagem = () => {
    setComercioSelecionado(null);
    setModalAberto(false);
  };

  const tituloCategoria = {
    mercadinhos: "🛒 Mercadinhos",
    lanchonetes: "🍔 Lanchonetes",
    farmacias: "💊 Farmácias",
    saloes: "✂️ Salões de Beleza",
    igrejas: "⛪ Igrejas",
    escolas: "🏫 Escolas",
    outros: "📌 Outros",
  };

  const irParaLogin = () => {
    window.location.href = "/LoginComercio";
  };

  const toggleCategoria = (cat) => {
    setAbertos((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };


    const abrirModalAvaliacao = (item) => {
    setAvaliarItem(item);
    setNota(0);
    setAvaliacaoModalAberto(true);
  };

  const fecharModalAvaliacao = () => {
    setAvaliacaoModalAberto(false);
    setAvaliarItem(null);
  };

  const enviarAvaliacao = async () => {
    if (!nota) return;
    try {
      await axios.post(`https://manaus-conectada.onrender.com/api/avaliar`, {
        id: avaliarItem._id,
        rating: nota
      });
      alert("Obrigado pela sua avaliação!");
      fecharModalAvaliacao();
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar avaliação");
    }
  };


  const renderCategoriaComBotao = (chave, lista) => (
    <div key={chave} style={{ marginBottom: "2rem" }}>
      <Stack direction="row" justifyContent="center" mb={2} px={2}>
        <Button
          variant="contained"
          onClick={() => toggleCategoria(chave)}
          sx={{
            width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
            textAlign: "left",
            justifyContent: "flex-start",
            py: 1.5,
            borderRadius: 2,
            background: "#1943b8",
            color: "#fff",
            fontWeight: "bold",
            boxShadow: "0px 4px 10px rgba(25, 67, 184, 0.2)",
            "&:hover": { backgroundColor: "#12359c" }
          }}
        >
          {tituloCategoria[chave] || chave}
        </Button>
      </Stack>

      <Collapse in={abertos[chave] || false} timeout="auto" unmountOnExit>
        <Grid container spacing={3} justifyContent="center" mt={2}>
          {lista.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  width: 300,
                  height: 495,
                  borderRadius: 3,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 2,
                  backgroundColor: "#ffffff",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
                  }
                }}
              >
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

                <CardContent sx={{ flexGrow: 1, overflowY: "auto", paddingRight: 1 }}>
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


                  <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer", textDecoration: "underline", mt: 0.5, fontWeight: "500" }}
                  onClick={() => abrirModalAvaliacao(item)}
                >
                  Avaliar este comércio
                </Typography>


                  <Box display="flex" alignItems="center" mt={1}>
                    <Rating name={`read-${item._id}`} value={item.rating || 0} precision={0.5} readOnly />
                    <Typography variant="body2" color="text.secondary" ml={1}>
                      ({item.ratingCount || 0})
                    </Typography>

                  </Box>
                  <Box mt={1}>
                    <Typography variant="body2">Avaliar:</Typography>
                    <Rating
                      name={`rate-${item._id}`}
                      value={0}
                      onChange={async (event, newValue) => {
                        if (!newValue) return;
                        try {
                          await axios.post(`https://manaus-conectada.onrender.com/api/avaliar`, {
                            id: item._id,
                            rating: newValue
                          });
                          alert("Obrigado pela sua avaliação!");
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    />

                  </Box>
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
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    sx={{ height: 40 }}
                    onClick={() => abrirModalComercio(item)}
                  >
                    Fazer pedido
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Collapse>


      {/* MODAL DE AVALIAÇÃO */}
      <Modal
        open={avaliacaoModalAberto}
        onClose={fecharModalAvaliacao}
        aria-labelledby="modal-titulo"
        aria-describedby="modal-descricao"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 320,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: "none"
          }}
        >
          <Typography id="modal-titulo" variant="h6" component="h2" mb={2}>
            Avaliar {avaliarItem?.nome}
          </Typography>
          <Rating
            name="avaliacao-modal"
            value={nota}
            precision={1}
            onChange={(event, newValue) => setNota(newValue)}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="outlined" onClick={fecharModalAvaliacao}>Cancelar</Button>
            <Button variant="contained" onClick={enviarAvaliacao} disabled={!nota}>
              Enviar
            </Button>
          </Stack>
        </Box>
      </Modal>

    </div>
  );

  return (
    <div style={{ padding: "2rem 1rem", backgroundColor: "#f3f3f3f3", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: { xs: 2, sm: 4 },
          fontSize: { xs: "1.5rem", sm: "2.2rem", md: "2.8rem" },
          color: "#1a237e",
          maxWidth: "900px",
          mx: "auto",
          px: { xs: 1, sm: 2 },
          textAlign: "center",
        }}
      >
        Guia de Comércios do Bairro
      </Typography>

      {busca.trim()
        ? renderCategoriaComBotao("Busca", comerciosFiltrados)
        : filtro
        ? renderCategoriaComBotao(filtro, categorias[filtro])
        : Object.entries(categorias).map(([chave, lista]) =>
            renderCategoriaComBotao(chave, lista)
          )}

      <Stack
        direction="column"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        mb={3}
        sx={{
          maxWidth: 300,
          mx: "auto",
          p: 2,
          borderRadius: 2,
          backgroundColor: "#f5f5f5",
          boxShadow: 1,
        }}
      >
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "#666", fontStyle: "italic", mb: 1 }}
        >
          Área exclusiva para Comercios cadastrados.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<LoginIcon />}
          onClick={irParaLogin}
          sx={{
            bgcolor: "rgba(25, 67, 184, 0.4)",
            "&:hover": { bgcolor: "#b52722" },
            fontWeight: "bold",
            fontSize: "0.95rem",
            paddingX: 2.2,
            paddingY: 0.9,
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "0 4px 10px rgba(39, 87, 217, 0.4)",
            width: "100%",
          }}
        >
          Área do Comerciante
        </Button>
      </Stack>

      <PanfletoModal
        open={modalAberto}
        onClose={fecharModalImagem}
        comercio={comercioSelecionado}
      />
    </div>
  );
}

export default Comercio;