import React, { useState } from "react";
import '../../Components/Importantes/presidente.css';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  Stack,
  Box,
  Divider,
  CardMedia
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import imege from '../../imgs/Foto perfil instagram homem sofisticado elegante fundo geométrico preto e vermelho.png';

function Importantes() {

  const [presidente] = useState([
    {
      img: imege,
      Cargo: 'Presidente do Bairro',
      nome: 'Sr(a) Jose',
      Missão: 'Nosso compromisso com o bairro!',
      numero: '5511999999999'
    }
  ]);

  const [comissao] = useState([
    { nome: 'Sr(a) Ana Paula', 
      cargo: 'Tesoureira', 
      funcao: 'Gerenciar finanças do bairro', 
      numero: '5511999999999' 
    },
    { nome: 'Sr(a) Carlos Silva', 
      cargo: 'Secretário', 
      funcao: 'Organizar documentos e reuniões', 
      numero: '5511999999999' 
    },
    { nome: 'Sr(a) Marta Oliveira', 
      cargo: 'Coordenadora de Eventos', 
      funcao: 'Planejar atividades comunitárias', 
      numero: '5511999999999' 
    },
    { nome: 'Sr(a) João Ferreira', 
      cargo: 'Responsável pela Segurança', 
      funcao: 'Monitorar e cuidar da segurança local', 
      numero: '5511999999999' 
    }
  ]);



  const openWhatsApp = (numero, nome) => {
    const mensagem = `Olá! Gostaria de saber mais sobre os assuntos do bairro com ${nome}.`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  return (
    <Box className="container-principal">
      <Typography variant="h4" className="titulo-secao">Central de Serviços Comunitários</Typography>

     {/* Presidente e Comissão Juntos */}
          <Typography variant="h5" className="titulo-secao">Presidência e Comissão do Bairro</Typography>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={8}>
              <Card sx={{ borderRadius: 4, boxShadow: 6, p: 3 }}>
                <CardContent>
                  {/* Presidente com imagem */}
                  <Box textAlign="center" mb={4}>
                    <CardMedia
                      component="img"
                      height="100"
                      image={presidente[0].img}
                      alt={presidente[0].nome}
                      sx={{ borderRadius: 3 }}
                    />
                    <Avatar
                      src={presidente[0].img}
                      alt={presidente[0].nome}
                      sx={{
                        width: 100,
                        height: 100,
                        margin: '-60px auto 10px',
                        border: '4px solid white',
                        boxShadow: 3
                      }}
                    />
                    <Typography variant="h6" color="text.secondary">{presidente[0].Cargo}</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">{presidente[0].nome}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>{presidente[0].Missão}</Typography>
                    <Stack mt={2} direction="row" justifyContent="center">
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
                        onClick={() => openWhatsApp(presidente[0].numero, presidente[0].nome)}
                      >
                        WhatsApp
                      </Button>
                    </Stack>
                  </Box>

                  {/* Comissão (sem imagem) */}
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>Membros da Comissão</Typography>
                  <Stack spacing={3}>
                    {comissao.map((c, index) => (
                      <Box key={index} sx={{ borderBottom: index !== comissao.length - 1 ? '1px solid #e0e0e0' : 'none', pb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">{c.cargo}</Typography>
                        <Typography variant="body1" fontWeight="bold">{c.nome}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>{c.funcao}</Typography>
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
                          onClick={() => openWhatsApp(c.numero, c.nome)}
                        >
                          WhatsApp
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      <Divider className="divisor" sx={{ my: 4 }} />

    </Box>
  );
}

export default Importantes;

