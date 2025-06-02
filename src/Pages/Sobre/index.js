import React from 'react';
import { Box, Typography, Divider, Grid } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import BuildIcon from '@mui/icons-material/Build';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import SchoolIcon from '@mui/icons-material/School';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CelebrationIcon from '@mui/icons-material/Celebration';

function ColoniaSantoAntonio() {
  return (
    <Box sx={{ p: 4, maxWidth: '1000px', mx: 'auto' }}>
     <Typography
        variant="h4"
        gutterBottom
        fontWeight="bold"
        sx={{
          fontSize: {
            xs: "1.5rem",  // em celulares
            sm: "2rem",    // tablets pequenos
            md: "2.5rem",  // tablets grandes ou desktops
            lg: "3rem"     // telas maiores
          },
          textAlign: "center",
          px: 2,           // padding horizontal para evitar encostar nas bordas em telas pequenas
        }}
      >
        Bairro Colônia Santo Antônio – História, Realidade e Desafios
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* Localização e População */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <LocationOnIcon color="primary" />
        </Grid>
        <Grid item xs>
          <Typography variant="h6">Localização e População</Typography>
          <Typography>
            Localizado na Zona Norte de Manaus, com população estimada de 10.303 habitantes. Principal via: Avenida Francisco Queiroz.
          </Typography>
        </Grid>
      </Grid>

      {/* Origem e Formação */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <HistoryEduIcon color="primary" />
        </Grid>
        <Grid item xs>
          <Typography variant="h6">Origem e Formação</Typography>
          <Typography>
            Fundado por migrantes, iniciou-se como colônia agrícola. Oficializado em 1983, nomeado em homenagem à igreja de Santo Antônio (1979).
          </Typography>
        </Grid>
      </Grid>

      {/* Infraestrutura */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <BuildIcon color="primary" />
        </Grid>
        <Grid item xs>
          <Typography variant="h6">Infraestrutura</Typography>
          <Typography>
            Urbanização tardia, com energia elétrica só em 1986 e asfalto em 2010. Coleta de lixo diária, porém falta áreas de lazer e centros culturais.
          </Typography>
        </Grid>
      </Grid>

      {/* Água */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <WaterDropIcon color="primary" />
        </Grid>
        <Grid item xs>
          <Typography variant="h6">Abastecimento de Água</Typography>
          <Typography>
            Serviço irregular; moradores recorrem a poços artesianos. Falta d’água ainda é um problema recorrente.
          </Typography>
        </Grid>
      </Grid>

      {/* Transporte */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <DirectionsBusIcon color="primary" />
        </Grid>
        <Grid item xs>
          <Typography variant="h6">Transporte Público</Typography>
          <Typography>
            Linhas 303, 314 e 454 atendem o bairro. Acesso à Max Teixeira facilita conexões. Finais de semana têm maior dificuldade.
          </Typography>
        </Grid>
      </Grid>

      {/* Educação */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <SchoolIcon color="primary" />
        </Grid>
        <Grid item xs>
          <Typography variant="h6">Educação</Typography>
          <Typography>
            Há apenas uma escola municipal e uma particular. Não há escolas estaduais, obrigando alunos a estudar em bairros vizinhos.
          </Typography>
        </Grid>
      </Grid>

      {/* Saúde */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <LocalHospitalIcon color="primary" />
        </Grid>
        <Grid item xs>
          <Typography variant="h6">Saúde</Typography>
          <Typography>
            O bairro tem uma unidade do programa Médico da Família. Moradores dependem de centros de saúde na Cidade Nova e Monte das Oliveiras.
          </Typography>
        </Grid>
      </Grid>

      {/* Comércio */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <StorefrontIcon color="primary" />
        </Grid>
        <Grid item xs>
          <Typography variant="h6">Comércio e Economia</Typography>
          <Typography>
            Comércio local ativo, mas dependente da Cidade Nova. Avenida Francisco Queiroz concentra padarias, mercados, oficinas e lojas diversas.
          </Typography>
        </Grid>
      </Grid>

      {/* Cultura */}
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <CelebrationIcon color="primary" />
        </Grid>
        <Grid item xs>
          <Typography variant="h6">Cultura e Tradições</Typography>
          <Typography>
            Comemorações tradicionais ocorrem no dia 13 de junho, com festa do padroeiro Santo Antônio. Associação de moradores pouco ativa fora do período eleitoral.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ColoniaSantoAntonio;
