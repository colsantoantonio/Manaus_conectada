import React, { useState, useEffect } from "react"; 
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Fade
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Noticia from "../../Components/G1news";
import CarroselComponent from "../../Components/Carrosel";
import Importantes from "../../Components/Importantes";
import "../Home/Home.css";
import MarkVip from "../../Components/MarkVip";
import Calendario from "../../Components/Calendario";
import { useNavigate } from "react-router-dom";


function Home() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [nomeUsuario, setNomeUsuario] = useState(localStorage.getItem('userFirstName') || '');
  const navigate = useNavigate();

  useEffect(() => {
    setNomeUsuario(localStorage.getItem('userFirstName') || '');
    const handleUserNameUpdated = (event) => {
      console.log('Evento recebido na Home com nome:', event.detail);
      setNomeUsuario(event.detail || '');
    };

    window.addEventListener('userNameUpdated', handleUserNameUpdated);

    return () => {
      window.removeEventListener('userNameUpdated', handleUserNameUpdated);
    };
  }, []);

  
  useEffect(() => {
    console.log('nomeUsuario mudou para:', nomeUsuario);
  }, [nomeUsuario]);

  const palavrasProibidas = [
    "fdp",
    "crlh",
    "filha da puta",
    "caralho",
    "Porra",
    "porra",
    "gay",
    "viado",
  ];

  const handleSubmit = () => {
    if (email.trim() === "" || mensagem.trim() === "") {
      setSnackbarMessage("Por favor, preencha todos os campos.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setTimeout(() => setSnackbarOpen(false), 7000);
      return;
    }

    const mensagemMinuscula = mensagem.toLowerCase();
    const contemPalavraProibida = palavrasProibidas.some(palavra =>
      mensagemMinuscula.includes(palavra)
    );

    if (contemPalavraProibida) {
      setSnackbarMessage("Sua mensagem contém palavras proibidas. Por favor, revise.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setTimeout(() => setSnackbarOpen(false), 7000);
      return;
    }

    setSnackbarMessage(`Sua mensagem foi enviada! Em breve entraremos em contato com ${email}.`);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 7000);
    setEmail("");
    setMensagem("");
  };

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <CarroselComponent />

      <Container maxWidth="lg" sx={{ mt: 4, marginTop: "-5px" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
           <Grid item xs={12} md={6}>
              <Box className="todos">
                <Container maxWidth="md" sx={{ mt: { xs: 2, md: 4 } }}>
                  {nomeUsuario && (
                    <Box
                      sx={{
                        bgcolor: "#fff",
                        p: { xs: 2, sm: 3, md: 4 },
                        borderRadius: 3,
                        boxShadow: 2,
                        textAlign: "center",
                        mb: { xs: 3, md: 5 },
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "bold",
                          fontSize: { xs: "1.3rem", sm: "1.5rem" },
                          mb: 1,
                          color: "#333",
                        }}
                      >
                        👋 Olá, {nomeUsuario}!
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: "0.95rem", sm: "1.05rem" },
                          color: "#555",
                        }}
                      >
                        Seja bem-vindo ao <strong>Manaus Conectada</strong> — o app que conecta moradores, comércios e serviços do seu bairro!
                      </Typography>

                      {/* Lista compacta */}
                      <Box
                        sx={{
                          mt: 2,
                          textAlign: "left",
                          bgcolor: "#f9f9f9",
                          borderRadius: 2,
                          p: { xs: 1.5, sm: 2 },
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: "bold",
                            mb: 1,
                            fontSize: "1rem",
                          }}
                        >
                          O que você encontra aqui:
                        </Typography>
                        <ul style={{ paddingLeft: "20px", margin: 0 }}>
                          <li>🛒 Ofertas de comércios locais</li>
                          <li>👷‍♂️ Profissionais perto de você</li>
                         <li>📰 Notícias atualizadas da cidade</li>
                        </ul>
                      </Box>

                      {/* Ações principais com boa responsividade */}
                      {/* <Box
                        sx={{
                          mt: 3,
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.5,
                        }}
                      >
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          py: 1.2,
                        }}
                        onClick={() => navigate("/mercadao")} // <- Aqui define o caminho da nova página
                      >
                        Comercios
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                          py: 1.2,
                        }}
                        onClick={() => navigate("/serviços")} // <- Aqui define o caminho da nova página
                      >
                        Profissionais
                      </Button>
                      </Box> */}
                    </Box>
                  )}

                  {/* Seções adicionais somente desktop */}
                  {isDesktop && (
                    <>
                      <Box sx={{ mb: 3 }}>
                        <MarkVip />
                      </Box>
                      <Box sx={{ mb: 3 }}>
                        <Importantes />
                      </Box>
                    </>
                  )}
                </Container>

                {/* Notícias e Formulário */}
                <Box className="segunda" sx={{ px: { xs: 1, sm: 2 } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      fontSize: { xs: "1.1rem", sm: "1.3rem" },
                    }}
                  >
                    🗞️ Últimas Notícias de Manaus
                  </Typography>

                  <Noticia />

                  <Typography
                    variant="body1"
                    sx={{
                      mt: 4,
                      mb: 2,
                      fontWeight: "bold",
                      fontSize: "1rem",
                      textAlign: "center",
                    }}
                  >
                    Quer contribuir com alguma informação?
                  </Typography>

                  <Fade in={snackbarOpen} timeout={{ enter: 500, exit: 500 }}>
                    <Box sx={{ mb: 2 }}>
                      {snackbarOpen && (
                        <Alert
                          severity={snackbarSeverity}
                          onClose={() => setSnackbarOpen(false)}
                        >
                          {snackbarMessage}
                        </Alert>
                      )}
                    </Box>
                  </Fade>

                  <TextField
                    fullWidth
                    label="Seu e-mail ou WhatsApp"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Compartilhe informações úteis para a comunidade"
                    variant="outlined"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                      py: 1.3,
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }}
                  >
                    🚀 Enviar
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
