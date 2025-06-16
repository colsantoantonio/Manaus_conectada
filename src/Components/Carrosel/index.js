import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Box, useTheme } from '@mui/material';
import img1 from '../../imgs/Seleção De Ofertas Supermercado Banner Amarelo Azul Verde.jpg';
import pizza from '../../imgs/pizza.png';
import pet from '../../imgs/pet.png';
import escola from '../../imgs/escolar.png';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const CarouselComponent = () => {
  const theme = useTheme();

  const slideStyles = {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxHeight: { xs: '200px', sm: '300px', md: '400px' }, // responsivo
  };

  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  return (
    <Box sx={{ width: '100%', px: 2, pt: 2 }}>
      <Carousel
        autoPlay
        infiniteLoop
        showArrows
        showThumbs={false}
        showStatus={false}
        interval={5000}
        transitionTime={600}
      >
        {[img1, pizza, pet, escola].map((imgSrc, index) => (
          <Box key={index} sx={slideStyles}>
            <img src={imgSrc} alt={`Slide ${index + 1}`} style={imageStyles} />
            {/* Você pode adicionar conteúdo em cima da imagem aqui, se quiser */}
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

export default CarouselComponent;


