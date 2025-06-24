import React, { useState, useEffect} from "react";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Box,
  Paper,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CircleIcon from "@mui/icons-material/Circle";

const statusColors = {
  online: "green",
  ocupado: "orange",
  offline: "gray",
};

function PaginaProfissionais() {
  const [profissionais, setProfissionais] = useState([]);
  const [busca, setBusca] = useState("");
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  const [loginTelefone, setLoginTelefone] = useState("");
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [novoStatus, setNovoStatus] = useState("");

  // Estados para Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Abrir modal de imagem
  const abrirModalImagem = (imagem) => {
    setImagemSelecionada(imagem);
    setModalAberto(true);
  };

  // Fechar modal de imagem
  const fecharModalImagem = () => {
    setImagemSelecionada(null);
    setModalAberto(false);
  };

  // Abrir WhatsApp com mensagem
  const openWhatsApp = (numero, nome) => {
    const mensagem = `Olá! Gostaria de saber mais sobre seus serviços, ${nome}.`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  // Função para abrir snackbar
  const abrirSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Fechar snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
  async function carregarProfissionais() {
    try {
      const response = await fetch("https://manaus-conectada.onrender.com/api/profissionais");
      if (!response.ok) throw new Error("Erro ao carregar profissionais");
      const data = await response.json();

      // Usar data diretamente, pois _id já existe
      setProfissionais(data);
    } catch (error) {
      console.error(error);
    }
  }
  carregarProfissionais();
}, []);
  // Filtra profissionais pelo nome ou serviço (ajustado para evitar erros)
  const buscaTrim = busca.trim().toLowerCase();

  const profissionaisFiltrados = profissionais.filter((p) => {
    const nome = p.nome ? p.nome.toLowerCase() : "";
    const servico = p.servico ? p.servico.toLowerCase() : "";
    return nome.includes(buscaTrim) || servico.includes(buscaTrim);
  });

  // Fazer login só com telefone
  const handleLogin = () => {
  const usuario = profissionais.find((p) => p.telefone === loginTelefone);
  if (usuario) {
    setUsuarioLogado(usuario);
    setNovoStatus(usuario.status);
    abrirSnackbar(`Bem-vindo, ${usuario.nome}! Você está logado.`, "success");
  } else {
    abrirSnackbar("Usuário não encontrado.", "error");
  }
};

  // Fazer logout
  const handleLogout = () => {
    setUsuarioLogado(null);
    setLoginTelefone("");
    setNovoStatus("");
    abrirSnackbar("Você saiu da conta.", "info");
  };

  // Atualizar status do usuário logado
 const handleSalvarStatus = async () => {
  if (!novoStatus) {
    abrirSnackbar("Selecione um status válido.", "warning");
    return;
  }

  try {
    const response = await fetch(`https://manaus-conectada.onrender.com/api/profissionais/${usuarioLogado._id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus }),
    });

    if (!response.ok) throw new Error('Erro ao atualizar status');

    const data = await response.json();

    setProfissionais(prev =>
      prev.map(p =>
        p._id === usuarioLogado._id ? { ...p, status: novoStatus } : p
      )
    );

    setUsuarioLogado(prev => ({ ...prev, status: novoStatus }));

    abrirSnackbar("Status atualizado com sucesso!", "success");
  } catch (error) {
    abrirSnackbar("Erro ao atualizar status.", "error");
    console.error(error);
  }
};

  // Função para trocar a foto do usuário logado
 const handleFotoChange = async (event) => {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  const formData = new FormData();
  formData.append("foto", arquivo);

  try {
    const response = await fetch(`https://manaus-conectada.onrender.com/api/profissionais/${usuarioLogado._id}/foto`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Erro ao enviar foto");

    const data = await response.json();

    // data.foto já é algo como "/uploads/arquivo.jpg"
    const urlFoto = `${data.foto}?t=${new Date().getTime()}`;

    setUsuarioLogado((prev) => ({ ...prev, foto: urlFoto }));
    setProfissionais((prev) =>
      prev.map((p) => (p._id === usuarioLogado._id ? { ...p, foto: urlFoto } : p))
    );

    abrirSnackbar("Foto atualizada com sucesso no servidor", "success");
  } catch (error) {
    abrirSnackbar("Erro ao enviar foto", "error");
  }
};

  return (
    <Box sx={{ p: 3, bgcolor: "#f0f2f5", minHeight: "100vh" }}>
      <Typography
        variant="body1"
        align="center"
        sx={{
          backgroundColor: '#0a01ab',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: { xs: '0.95rem', sm: '1.05rem' },
          color: 'white',
          fontWeight: 500,
          mb: 3,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
        }}
      >
        👷 Profissionais
      </Typography>

    
      {!usuarioLogado ? (
        <Paper
          elevation={3}
          sx={{
            maxWidth: 360,
            mx: "auto",
            p: 3,
            borderRadius: 3,
            textAlign: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="body1" sx={{ mb: 2, color: "#666" }}>
            Área exclusiva para profissionais cadastrados.
          </Typography>

          <TextField
            placeholder="Digite sua Senha"
            variant="outlined"
            fullWidth
            value={loginTelefone}
            onChange={(e) => setLoginTelefone(e.target.value)}
            inputProps={{ inputMode: "tel" }}
            size="small"
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleLogin}
          >
            Entrar
          </Button>
        </Paper>
      ) : (
        <Paper
          elevation={3}
          sx={{
            maxWidth: 420,
            mx: "auto",
            p: 3,
            borderRadius: 3,
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Olá, {usuarioLogado.nome}!
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-label">Alterar Status</InputLabel>
            <Select
              labelId="status-label"
              value={novoStatus}
              label="Alterar Status"
              onChange={(e) => setNovoStatus(e.target.value)}
            >
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="ocupado">Ocupado</MenuItem>
              <MenuItem value="offline">Offline</MenuItem>
            </Select>
          </FormControl>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSalvarStatus}
            >
              Salvar
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleLogout}
            >
              Sair
            </Button>
          </Stack>

          <Button variant="outlined" component="label" fullWidth>
            Trocar Foto
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFotoChange}
            />
          </Button>
        </Paper>
      )}

      <Box sx={{ mt: 5, mb: 3, display: "flex", justifyContent: "center" }}>
        <TextField
          label="Buscar por nome ou serviço"
          variant="outlined"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          sx={{ width: "100%", maxWidth: 400 }}
        />
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {profissionaisFiltrados.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              sx={{
                height: 300,
                width:300,
                borderRadius: 3,
                boxShadow: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                bgcolor: "#ffffff",
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    src={item.foto}
                    alt={item.nome}
                    sx={{
                      width: 64,
                      height: 64,
                      border: `3px solid ${statusColors[item.status]}`,
                    }}
                  />
                }
                title={
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    noWrap
                    sx={{ color: "#333", maxWidth: 180 }}
                  >
                    {item.nome}
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {item.servico}
                  </Typography>
                }
              />

              <CardContent sx={{ pt: 0 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <PhoneIcon sx={{ color: "#555" }} />
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    {item.telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <LocationOnIcon sx={{ color: "#555" }} />
                  <Button
                    variant="text"
                    size="small"
                    href={item.localizacao}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textTransform: "none", color: "#1976d2" }}
                  >
                    Ver localização
                  </Button>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CircleIcon
                      sx={{
                        fontSize: 14,
                        color: statusColors[item.status] || "gray",
                      }}
                    />
                    <Typography variant="caption" sx={{ color: "#555" }}>
                      {item.status}
                    </Typography>
                  </Stack>

                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<WhatsAppIcon />}
                    onClick={() => openWhatsApp(item.telefone, item.nome)}
                    sx={{ textTransform: "none", fontWeight: "bold" }}
                  >
                    WhatsApp
                  </Button>
                </Stack>
              </CardContent>

              <Button
                variant="text"
                onClick={() => abrirModalImagem(item.foto)}
                sx={{ fontSize: 12, color: "#1976d2", mb: 1 }}
              >
                Visualizar foto
              </Button>
            </Card>
          </Grid>
        ))}

        {profissionaisFiltrados.length === 0 && (
          <Typography
            variant="body1"
            align="center"
            sx={{ mt: 5, width: "100%", color: "#777" }}
          >
            Nenhum profissional encontrado para a busca "{busca}".
          </Typography>
        )}
      </Grid>

      {/* Modal de imagem */}
      <Dialog
        open={modalAberto}
        onClose={fecharModalImagem}
        fullScreen={fullScreen}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent
          sx={{
            p: 1,
            backgroundColor: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={fecharModalImagem}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#fff",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <CloseIcon />
          </IconButton>

          {imagemSelecionada && (
            <img
              src={imagemSelecionada}
              alt="Foto do profissional"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: 8,
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PaginaProfissionais;
