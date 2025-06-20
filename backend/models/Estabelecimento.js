// models/Estabelecimento.js
const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  id: Number,
  nome: String,
  preco: Number,
  categoria: String,
  imagem: String
});

const estabelecimentoSchema = new mongoose.Schema({
  tipo: String,
  nome: String,
  numero: String,
  horario: String,
  entrega: String,
  logo: String,
  panfleto: String,
  localizacao: String,
  categorias: [String],
  produtos: [produtoSchema],
  rating: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Estabelecimento', estabelecimentoSchema, 'Mercados');


