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
  Typography,
  Slide
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalBoasVindas = () => {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('userFirstName');
    const lastShown = localStorage.getItem('modalBoasVindasTimestamp');

    const now = Date.now();
    const hours24 = 24 * 60 * 60 * 1000;

    if (savedName) {
      setFirstName(savedName);
      setSubmitted(true);
    }

    if (!lastShown || now - Number(lastShown) > hours24) {
      const timer = setTimeout(() => {
        setOpen(true);
        localStorage.setItem('modalBoasVindasTimestamp', now.toString());
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError(true);
      return;
    }

    localStorage.setItem('userFirstName', firstName.trim());
    setSubmitted(true);
    window.dispatchEvent(new CustomEvent('userNameUpdated', { detail: firstName.trim() }));

    setTimeout(() => {
      setOpen(false);
    }, 3000);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
      aria-labelledby="modal-title"
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          padding: 3,
          background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
          boxShadow: 6,
        }
      }}
    >
      <DialogTitle
        id="modal-title"
        sx={{
          textAlign: 'center',
          position: 'relative',
          fontWeight: 'bold',
          color: '#2c3e50',
          fontSize: '1.4rem',
          pb: 1
        }}
      >
        Bem-vindo à Comunidade!
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {!submitted ? (
          <>
            <DialogContentText
              sx={{
                textAlign: 'center',
                mb: 3,
                fontSize: '1rem',
                color: '#555',
              }}
            >
              Participe da comunidade, compartilhe novidades e receba promoções exclusivas da sua região!
            </DialogContentText>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                autoFocus
                fullWidth
                required
                label="Digite seu primeiro nome"
                variant="outlined"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (error && e.target.value.trim()) setError(false);
                }}
                error={error}
                helperText={error ? 'Nome é obrigatório para continuar.' : ''}
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!firstName.trim()}
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: 'bold',
                  borderRadius: 2,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #3f51b5 0%, #283593 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #283593 0%, #1a237e 100%)',
                  }
                }}
              >
                Entrar na Comunidade
              </Button>
            </Box>
          </>
        ) : (
          <Box textAlign="center" py={4}>
            <EmojiEmotionsIcon sx={{ fontSize: 48, color: '#2e7d32', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
              🎉 Bem-vindo{firstName ? `, ${firstName}` : ''}!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: '#444' }}>
              Estamos felizes em ter você com a gente!
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalBoasVindas;

