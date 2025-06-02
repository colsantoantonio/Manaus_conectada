import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardHeader,
  Avatar,
  Button,
  Stack
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

function Marketing() {
  const [mercadinhos] = useState([
    {
      nome: "Mercadinho Ceará",
      numero: "+5592993847070",
      horario: "5h30 às 9h00",
      entrega: "Entregamos a domicílio",
    },
    {
      nome: "Mini Box da Leste",
      numero: "+5592991234567",
      horario: "6h00 às 22h00",
      entrega: "Delivery grátis na ZL",
    },
    {
      nome: "Super Econômico",
      numero: "+5592992349876",
      horario: "24 horas",
      entrega: "Delivery e retirada",
    },
  ]);

  const openWhatsApp = (numero, nome) => {
    const mensagem = `Olá! Gostaria de saber mais sobre os produtos do ${nome}.`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      style={{
        padding: "2rem",
        background: "linear-gradient(to right, #f8fafc, #e2e8f0)",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1f2937", marginBottom: 4 }}
      >
        🛒 Comércios do Bairro
      </Typography>
      <Grid container spacing={3}>
        {mercadinhos.map((mercado, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 6,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 10,
                },
                backgroundColor: "#ffffff",
              }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "#25D366" }}>
                    <StoreIcon />
                  </Avatar>
                }
                title={mercado.nome}
                subheader="Comércio local"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <PhoneIcon fontSize="small" /> {mercado.numero}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <AccessTimeIcon fontSize="small" /> {mercado.horario}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <LocalShippingIcon fontSize="small" /> {mercado.entrega}
                </Typography>
                <Stack mt={2} direction="row" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: "#25D366",
                      "&:hover": { bgcolor: "#1ebe5d" },
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                    startIcon={<WhatsAppIcon />}
                    onClick={() => openWhatsApp(mercado.numero, mercado.nome)}
                  >
                    WhatsApp
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Marketing;

