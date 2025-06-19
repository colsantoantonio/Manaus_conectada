// models/Mercado.js
const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  id: Number,
  nome: String,
  preco: Number,
  categoria: String,
  imagem: String,
});

const mercadoSchema = new mongoose.Schema({
  nome: String,
  numero: String,
  horario: String,
  entrega: String,
  logo: String,
  panfleto: String,
  localizacao: String,
  categoriaTipo: String,
  categorias: [String],
  produtos: [produtoSchema],
});

module.exports = mongoose.model('Mercado', mercadoSchema);
