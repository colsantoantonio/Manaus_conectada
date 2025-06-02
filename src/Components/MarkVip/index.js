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
  TextField
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

function MarkVip() {

  const [Busca, setBusca] = useState("");
  
  const openWhatsApp = (numero, nome) => {
    const mensagem = `Olá! Gostaria de saber mais sobre os serviços do ${nome}.`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  const [todos] = useState([
    {
      nome: "Mercadinho Ceará",
      numero: "+559299999999",
      horario: "5h30 às 9h00",
      entrega: "Entregamos a domicílio",
    },
    {
      nome: "Mini Box da Leste",
      numero: "+5592999999999",
      horario: "6h00 às 22h00",
      entrega: "Delivery grátis na ZL",
    },
  ]);



  const comerciosFiltrados = [...todos].filter((item) =>
    item.nome.toLowerCase().includes(Busca.toLowerCase())
  );

  const renderComercios = (titulo, lista) => (
    <>
      <Typography
        variant="h5"
        sx={{
          mt: 6,
          mb: 2,
          fontWeight: "bold",
          textAlign: "center"
        }}
      >
        {titulo}
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {lista.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
           <Card
                sx={{
                    width: 300, // largura fixa
                    height: 230, // altura fixa
                    borderRadius: 3,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                }}
                >
                <CardHeader
                    avatar={
                    <Avatar sx={{ bgcolor: "#25D366" }}>
                        <StoreIcon />
                    </Avatar>
                    }
                    title={item.nome}
                    subheader="Comércio local"
                />
                <CardContent
                    sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    }}
                >
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                    <PhoneIcon fontSize="small" /> {item.numero}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                    <AccessTimeIcon fontSize="small" /> {item.horario}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    <LocalShippingIcon fontSize="small" /> {item.entrega}
                    </Typography>

                    <Stack
                    mt="auto"
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    justifyContent="flex-end"
                    >
                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => openWhatsApp(item.numero, item.nome)}
                    >
                        WhatsApp
                    </Button>
                    </Stack>
                </CardContent>
              </Card>

          </Grid>
        ))}
      </Grid>
    </>
  );

      return (
        <div
          style={{
            padding: "2rem",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            backgroundColor: "#f9fafb",
            minHeight: "100vh",
          }}
        >
          
          {comerciosFiltrados.length > 0
            ? renderComercios("Faça seu pedido, agora mesmo!!", comerciosFiltrados)
            : <Typography align="center" sx={{ mt: 4}}>Nenhum comércio encontrado.</Typography>}


        </div>
      );
}

export default MarkVip;