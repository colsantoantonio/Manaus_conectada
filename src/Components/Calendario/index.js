import React, { useState } from "react";
import { Box, Paper, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import ptBR from "date-fns/locale/pt-BR";
import { format } from "date-fns";

// ✅ Eventos da comunidade com título e descrição
const eventosComunitarios = [
  {
    data: "2025-05-18",
    titulo: "Culto da Família",
    descricao: "Culto especial na Igreja Batista às 19h para todas as famílias."
  },
  {
    data: "2025-05-20",
    titulo: "Feira de Ciências",
    descricao: "Feira anual da Escola João da Silva com participação dos aluno,"
  },
  {
    data: "2025-05-25",
    titulo: "Campeonato de Futebol",
    descricao: "Torneio Sub-17 na quadra da Colônia Santo Antônio às 16h."
  }
];

export default function CalendarioComunitario() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const dataFormatada = format(dataSelecionada, "yyyy-MM-dd");

  // Verifica se existe evento na data selecionada
  const eventoDoDia = eventosComunitarios.find(
    (evento) => evento.data === dataFormatada
  );

  const datasEventos = eventosComunitarios.map((e) => e.data);

  return (
    <Box
      sx={{
        mt: 6,
        textAlign: "center",
        px: isMobile ? 2 : 0 // padding lateral em mobile
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Calendário da Comunidade
      </Typography>

      <Paper
        elevation={3}
        sx={{
          display: "inline-block",
          p: isMobile ? 2 : 3,
          borderRadius: 3,
          width: isMobile ? "100%" : "auto"
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <DateCalendar
            value={dataSelecionada}
            onChange={(novaData) => setDataSelecionada(novaData)}
            sx={{ maxWidth: "100%" }}
            slots={{
              day: (props) => {
                const dateStr = props.day?.toISOString().split("T")[0];
                const isEvent = datasEventos.includes(dateStr);
                return (
                  <PickersDay
                    {...props}
                    sx={{
                      backgroundColor: isEvent ? "#1976d2" : "inherit",
                      color: isEvent ? "#fff" : "inherit",
                      borderRadius: "50%"
                    }}
                  />
                );
              }
            }}
          />
        </LocalizationProvider>

        <Typography sx={{ mt: 2 }}>
          Data selecionada: {dataSelecionada.toLocaleDateString("pt-BR")}
        </Typography>

        {/* Exibe evento se existir na data */}
        {eventoDoDia && (
          <Box sx={{ mt: 2, textAlign: "left" }}>
            <Typography variant="h6" fontWeight="bold">
              {eventoDoDia.titulo}
            </Typography>
            <Typography variant="body2">{eventoDoDia.descricao}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

