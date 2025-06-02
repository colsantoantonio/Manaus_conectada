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

function Home() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [nomeUsuario, setNomeUsuario] = useState(localStorage.getItem('userFirstName') || '');

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
            <div className="todos">
              <div className="primeira">
                <Container maxWidth="md" sx={{ mt: 4 }}>
                 {nomeUsuario && (
                  <Typography
                    key={nomeUsuario}
                    variant="h5"
                    gutterBottom
                    bgcolor="white"
                    width="100%"
                    sx={{
                      fontSize: { xs: "1.2rem", sm: "1.8rem", md: "2rem" },
                      textAlign: "center",
                      color: "black",
                      py: { xs: 1.5, sm: 2 },
                      px: 2,
                      borderRadius: 2,
                      boxShadow: 3,
                      lineHeight: 1.4,
                    }}
                  >
                    Olá, {nomeUsuario}! 👋 <br />
                    Bem-vindo à <strong>Manaus Conectada</strong> — o app que fortalece o seu bairro!
                  </Typography>
                )}


                <div style={{ marginTop: "20px" }}>
                  <MarkVip />
                </div>

                {isDesktop && (
                  <div style={{ marginTop: "20px" }}>
                    <Importantes />
                  </div>
                )}
                 </Container>               
              </div>

              <div className="segunda">
                <Typography variant="h5" gutterBottom>
                  Últimas Notícias de Manaus
                </Typography>
                <Noticia />

                 <Typography
                    variant="body1"
                    sx={{
                      mb: { xs: 2, sm: 4 },
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                      lineHeight: 1.6,
                      textAlign:"center",
                      marginTop:"25px"
                    }}
                  >
                    Compartilhe aqui!!
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
                  label="Seu e-mail ou whatsapp"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="Compartilhe informações..."
                  variant="outlined"
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Button fullWidth variant="contained" onClick={handleSubmit}>
                  Enviar
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
