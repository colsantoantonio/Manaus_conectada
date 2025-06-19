// routes/produtos.js
const express = require('express');
const router = express.Router();
const Estabelecimento = require('../models/Estabelecimento');

// ✅ GET - Listar produtos de um estabelecimento
router.get('/:numero', async (req, res) => {
  const { numero } = req.params;

  try {
    const estabelecimento = await Estabelecimento.findOne({ numero });
    if (!estabelecimento) return res.status(404).json({ message: 'Estabelecimento não encontrado' });

    res.json(estabelecimento.produtos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
});

// ✅ POST - Adicionar novo produto
router.post('/:numero', async (req, res) => {
  const { numero } = req.params;
  const novoProduto = req.body;

  try {
    const estabelecimento = await Estabelecimento.findOne({ numero });
    if (!estabelecimento) return res.status(404).json({ message: 'Estabelecimento não encontrado' });

    estabelecimento.produtos.push(novoProduto);
    await estabelecimento.save();

    res.status(201).json({ message: 'Produto adicionado com sucesso', produtos: estabelecimento.produtos });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao adicionar produto' });
  }
});

// ✅ PUT - Editar um produto existente
router.put('/:numero/:produtoId', async (req, res) => {
  const { numero, produtoId } = req.params;
  const dadosAtualizados = req.body;

  try {
    const estabelecimento = await Estabelecimento.findOne({ numero });
    if (!estabelecimento) return res.status(404).json({ message: 'Estabelecimento não encontrado' });

    const produto = estabelecimento.produtos.id(produtoId);
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });

    Object.assign(produto, dadosAtualizados);

    await estabelecimento.save();
    res.json({ message: 'Produto atualizado com sucesso', produto });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao editar produto' });
  }
});

// ✅ DELETE - Remover produto
router.delete('/:numero/:produtoId', async (req, res) => {
  const { numero, produtoId } = req.params;

  try {
    const estabelecimento = await Estabelecimento.findOne({ numero });
    if (!estabelecimento) return res.status(404).json({ message: 'Estabelecimento não encontrado' });

    estabelecimento.produtos = estabelecimento.produtos.filter(p => p._id.toString() !== produtoId);
    await estabelecimento.save();

    res.json({ message: 'Produto removido com sucesso', produtos: estabelecimento.produtos });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar produto' });
  }
});

module.exports = router;
