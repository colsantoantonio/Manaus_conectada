// routes/login.js
const express = require('express');
const router = express.Router();
const Estabelecimento = require('../models/Estabelecimento');

router.post('/', async (req, res) => {
  const { numero } = req.body;

  if (!numero) {
    return res.status(400).json({ message: 'Número é obrigatório' });
  }

  try {
    const estabelecimento = await Estabelecimento.findOne({ numero });

    if (!estabelecimento) {
      return res.status(404).json({ message: 'Estabelecimento não encontrado' });
    }

    res.status(200).json({ estabelecimento });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;