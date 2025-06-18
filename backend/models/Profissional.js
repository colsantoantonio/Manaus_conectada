const mongoose = require('mongoose'); 

const profissionalSchema = new mongoose.Schema({
  id: Number, // se você quiser manter um ID personalizado
  nome: {
    type: String,
    required: true
  },
  telefone: {
    type: String,
    required: true,
    unique: true
  },
  servico: {
    type: String,
    required: true
  },
  localizacao: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['online', 'ocupado', 'offline'], // corrigido
    default: 'offline'
  },
  foto: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profissional', profissionalSchema);

