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
  produtos: [produtoSchema]
});

module.exports = mongoose.model('Estabelecimento', estabelecimentoSchema, 'Mercados');

