const mongoose = require('mongoose');

const profissionalSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['disponível', 'ocupado', 'offline'],
    default: 'disponível'
  },
  foto: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profissional', profissionalSchema);
