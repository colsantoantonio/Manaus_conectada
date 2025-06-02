import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ModalBoasVindas = () => {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('userFirstName');
    if (savedName) {
      setFirstName(savedName);
      setSubmitted(true); // já mostra mensagem de boas-vindas
    }

    const timer = setTimeout(() => {
      setOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstName.trim()) {
      localStorage.setItem('userFirstName', firstName);
      setSubmitted(true);

      window.dispatchEvent(new CustomEvent('userNameUpdated', { detail: firstName }));
      console.log('Evento disparado com nome:', firstName);

      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="welcome-dialog-title"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
          '@media (min-width:600px)': {
            width: 500,
          },
        }
      }}
    >
      <DialogTitle 
        id="welcome-dialog-title" 
        sx={{ 
          textAlign: 'center', 
          pt: 4, 
          position: 'relative'
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            width: 36,
            height: 36,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" component="div" sx={{ 
          fontWeight: 'bold',
          color: '#2c3e50',
          mb: 2
        }}>
          Bem-vindo à Comunidade Manaus Conectada!
        </Typography>
      </DialogTitle>

      <DialogContent>
        {!submitted ? (
          <>
            <DialogContentText sx={{ 
              textAlign: 'center', 
              mb: 3,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              color: '#555'
            }}>
              Conecte-se com a comunidade, compartilhe notícias e aproveite as promoções dos mercados locais!
            </DialogContentText>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                autoFocus
                margin="dense"
                id="firstName"
                label="Qual é o seu primeiro nome?"
                type="text"
                fullWidth
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#fff'
                  }
                }}
                required
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #3f51b5 0%, #283593 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #283593 0%, #1a237e 100%)'
                  }
                }}
              >
                Acessar Comunidade
              </Button>
            </Box>
          </>
        ) : (
          <DialogContentText sx={{ 
            textAlign: 'center', 
            fontSize: { xs: '1rem', sm: '1.2rem' },
            py: 4,
            color: '#2e7d32'
          }}>
            🎉 Bem-vindo{firstName ? `, ${firstName}` : ''}! Estamos felizes em ter você com a gente!
          </DialogContentText>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalBoasVindas;


