const mongoose = require('mongoose');

const ProfissionalSchema = new mongoose.Schema({
  nome: String,
  serviço: String,
  telefone: String,
  localização: String,
  status: String,
  foto: String
});

module.exports = mongoose.model('Profissional', ProfissionalSchema);
