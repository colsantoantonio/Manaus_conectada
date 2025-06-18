const mongoose = require('mongoose'); 

const profissionalSchema = new mongoose.Schema({
  id: Number, // ID customizado, ok!
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
    enum: ['online', 'ocupado', 'offline'], // OK!
    default: 'offline'
  },
  foto: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'Profissionais' // 👈 Força o nome exato da coleção existente no Atlas
});

module.exports = mongoose.model('Profissional', profissionalSchema);
