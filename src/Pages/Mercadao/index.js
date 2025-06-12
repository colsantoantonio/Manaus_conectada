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
import { Carousel } from 'react-responsive-carousel';
import { Box, useTheme } from '@mui/material';
import img from '../../imgs/Seleção De Ofertas Supermercado Banner Amarelo Azul Verde.jpg';
import Comercio from "../../Components/Comercios";
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Estilos do carrossel

function Mercadao(){

    const [Ceara, SetCeara] = useState([
        {
            nome: "Mercadinho Ceará",
            numero: "+5592993847070",
            horario: "5h30 às 9h00",
            entrega: "Entregamos a domicílio",
        }
    ])

    const openWhatsApp = (numero, nome) => {
        const mensagem = `Olá! Gostaria de saber mais sobre os produtos do ${nome}.`;
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, "_blank");
      };

      const theme = useTheme();

    return(

                <div className="body">
                    <div className="texto" >
                    <Comercio/>
                    </div>
                </div>
    
    )
}
export default Mercadao;