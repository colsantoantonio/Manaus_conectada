import React from "react";
import { Container, Grid, Box, Typography, Paper } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import Importantes from "../../Components/Importantes";

function Contato() {
  return (
    <Box sx={{ backgroundColor: '#f0f4f8', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">

        <Importantes />

      </Container>
    </Box>
  );
}

export default Contato;
