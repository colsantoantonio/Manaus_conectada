import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  CardMedia,
  Box
} from "@mui/material";
import ChurchIcon from "@mui/icons-material/Church";
import SchoolIcon from "@mui/icons-material/School";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import teste from "../../imgs/Fnoticias/Culto de estudo bíblico post instagram simples tons terrosos.png";
import arrecadação from "../../imgs/Fnoticias/arrecadação.png";
import ambiente from "../../imgs/Fnoticias/meioambiente.png";
import matriculas from "../../imgs/Fnoticias/matriculas.png";
import jogo from "../../imgs/Fnoticias/jogo.png";
import zumba from "../../imgs/Fnoticias/zumba.png";

import CalendarioComunitario from "../../Components/Calendario";

const noticias = {
  igreja: [
    {
      titulo: "Culto da Família neste Domingo",
      descricao: "A Igreja Batista realizará um culto especial voltado para as famílias às 19h.",
      imagem: teste,
      data: "2025-05-18"
    },
    {
      titulo: "Arrecadação de alimentos",
      descricao: "Estamos arrecadando alimentos para distribuir a famílias carentes neste fim de semana.",
      imagem: arrecadação,
      data: "2025-05-20"
    }
  ],
  escola: [
    {
      titulo: "Feira de Ciências 2025",
      descricao: "A Escola Estadual João da Silva realizará sua tradicional Feira de Ciências na próxima sexta-feira.",
      imagem: ambiente,
      data: "2025-05-23"
    },
    {
      titulo: "Matrículas abertas",
      descricao: "As matrículas para o ano letivo de 2026 já estão abertas. Procure a secretaria da escola.",
      imagem: matriculas,
      data: "2025-05-25"
    }
  ],
  esportes: [
    {
      titulo: "Campeonato de Futebol Sub-17",
      descricao: "Neste sábado ocorrerá o torneio regional no campo da Colônia Santo Antônio.",
      imagem: jogo,
      data: "2025-05-17"
    },
    {
      titulo: "Aula de Zumba gratuita",
      descricao: "Todas as quartas às 18h na quadra poliesportiva do bairro.",
      imagem: zumba,
      data: "2025-05-21"
    }
  ]
};

const renderNoticias = (categoria, icone) => (
    <Box>
      <Typography
        variant="h5"
        sx={{
          mt: 4,
          mb: 2,
          fontWeight: "bold",
          textAlign: "center"
        }}
      >
        {categoria}
      </Typography>
      <Grid container spacing={3}>
        {noticias[categoria.toLowerCase()].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                image={item.imagem}
                alt={item.titulo}
                sx={{
                  width: "100%",
                  height: { xs: 180, sm: 200, md: 220 },
                  objectFit: "contain",
                  backgroundColor: "#f5f5f5",
                  display: "block",
                  borderBottom: "1px solid #ccc"
                }}
              />
              <CardHeader
                avatar={<Avatar>{icone}</Avatar>}
                title={item.titulo}
                titleTypographyProps={{ fontWeight: "bold" }}
              />
              <CardContent>
                <Typography variant="body2">{item.descricao}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
);

    function PaginaNoticias() {
      return (
        <Box sx={{ width: "100%" }}>
          <Container
            maxWidth="lg"
            sx={{
              mt: { xs: 2, sm: 4 },
              mb: 6,
              px: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              variant="h4"
              align="center"
              fontWeight="bold"
              gutterBottom
            >
              Notícias Locais da Comunidade
            </Typography>

            {renderNoticias("Igreja", <ChurchIcon />)}
            {renderNoticias("Escola", <SchoolIcon />)}
            {renderNoticias("Esportes", <SportsSoccerIcon />)}

            <Box
              sx={{
                mt: 6,
                px: { xs: 0, sm: 2 },
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: { xs: "100%", sm: 600, md: 800 },
                }}
              >
                <CalendarioComunitario
                  eventos={[
                    ...noticias.igreja,
                    ...noticias.escola,
                    ...noticias.esportes,
                  ]}
                />
              </Box>
            </Box>
          </Container>
        </Box>

      );
    }


export default PaginaNoticias;



