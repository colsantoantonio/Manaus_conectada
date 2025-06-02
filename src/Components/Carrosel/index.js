import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Box, Typography, useTheme } from '@mui/material';
import img1 from '../../imgs/Seleção De Ofertas Supermercado Banner Amarelo Azul Verde.jpg';
import pizza from '../../imgs/pizza.png';
import pet from '../../imgs/pet.png';
import escola from '../../imgs/escolar.png'
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Estilos do carrossel

const CarouselComponent = () => {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: '100%', position: 'relative', padding:'10px' }}>
      <Carousel 
        autoPlay
        infiniteLoop
        showArrows
        showThumbs={false}
        showStatus={false}
        interval={5000}
        transitionTime={600}
      >
        {/* Slide 1 */}
        <Box>
          <img src={img1} alt="Slide 1" />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: theme.palette.common.white,
            }}
          >
          </Box>
        </Box>

        {/* Slide 2 */}
        <Box>
          <img src={pizza} alt="Slide 2" />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: theme.palette.common.white,
            }}
          >
          </Box>
        </Box>

        {/* Slide 3 */}
        <Box>
          <img src={pet} alt="Slide 3" />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: theme.palette.common.white,
            }}
          >
          </Box>
        </Box>


        {/* Slide 4 */}
        <Box>
          <img src={escola} alt="Slide 3" />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: theme.palette.common.white,
            }}
          >
          </Box>
        </Box>
      </Carousel>
    </Box>
  );
};

export default CarouselComponent;

