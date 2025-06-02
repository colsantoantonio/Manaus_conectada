const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const getNoticias = require('./scraper');
const multer = require('multer');

// Pasta onde as fotos serão salvas
const upload = multer({ dest: path.join(__dirname, 'uploads') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Necessário para ler JSON no body das requisições

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

// Endpoint para listar profissionais
app.get('/api/profissionais', (req, res) => {
  const { status } = req.query;
  const filePath = path.join(__dirname, 'data', 'serviços.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler arquivo serviços.json:', err);
      return res.status(500).json({ message: 'Erro ao carregar profissionais' });
    }

    let profissionais;
    try {
      profissionais = JSON.parse(data);
    } catch (parseErr) {
      console.error('Erro ao parsear JSON de profissionais:', parseErr);
      return res.status(500).json({ message: 'Erro ao processar dados dos profissionais' });
    }

    if (status) {
      profissionais = profissionais.filter(p => {
        if (!p.status) return false;
        return p.status.toLowerCase() === status.toLowerCase();
      });
    }

    res.json(profissionais);
  });
});

// Endpoint para atualizar o status de um profissional
app.put('/api/profissionais/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const filePath = path.join(__dirname, 'data', 'serviços.json');

  if (!status) {
    return res.status(400).json({ message: 'Status é obrigatório.' });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler arquivo serviços.json:', err);
      return res.status(500).json({ message: 'Erro ao carregar profissionais' });
    }

    let profissionais;
    try {
      profissionais = JSON.parse(data);
    } catch (parseErr) {
      console.error('Erro ao parsear JSON de profissionais:', parseErr);
      return res.status(500).json({ message: 'Erro ao processar dados' });
    }

    const index = profissionais.findIndex(p => String(p.id) === String(id));

    if (index === -1) {
      return res.status(404).json({ message: 'Profissional não encontrado.' });
    }

    profissionais[index].status = status;

    fs.writeFile(filePath, JSON.stringify(profissionais, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Erro ao salvar arquivo:', writeErr);
        return res.status(500).json({ message: 'Erro ao salvar status' });
      }

      res.json({ message: 'Status atualizado com sucesso.', profissional: profissionais[index] });
    });
  });
});

// Endpoint para trocar foto do profissional
app.post('/api/profissionais/:id/foto', upload.single('foto'), (req, res) => {
  const { id } = req.params;
  const filePath = path.join(__dirname, 'data', 'serviços.json');

  if (!req.file) {
    return res.status(400).json({ message: 'Arquivo de foto é obrigatório.' });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler arquivo serviços.json:', err);
      return res.status(500).json({ message: 'Erro ao carregar profissionais' });
    }

    let profissionais;
    try {
      profissionais = JSON.parse(data);
    } catch (parseErr) {
      console.error('Erro ao parsear JSON de profissionais:', parseErr);
      return res.status(500).json({ message: 'Erro ao processar dados' });
    }

    const index = profissionais.findIndex(p => String(p.id) === String(id));

    if (index === -1) {
      // Apaga o arquivo enviado, pois não será usado
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Profissional não encontrado.' });
    }

    // Excluir foto antiga, se existir
    if (profissionais[index].foto) {
      const fotoAntigaPath = path.join(__dirname, 'uploads', path.basename(profissionais[index].foto));
      if (fs.existsSync(fotoAntigaPath)) {
        fs.unlinkSync(fotoAntigaPath);
      }
    }

    // Renomear o arquivo enviado para um nome mais amigável
    const extensao = path.extname(req.file.originalname);
    const novoNome = `profissional-${id}-${Date.now()}${extensao}`;
    const novoPath = path.join(__dirname, 'uploads', novoNome);

    fs.rename(req.file.path, novoPath, (renameErr) => {
      if (renameErr) {
        console.error('Erro ao renomear arquivo:', renameErr);
        return res.status(500).json({ message: 'Erro ao processar arquivo' });
      }

      // Atualiza o campo foto no JSON
      profissionais[index].foto = `/uploads/${novoNome}`;

      // Salva o JSON atualizado
      fs.writeFile(filePath, JSON.stringify(profissionais, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Erro ao salvar arquivo:', writeErr);
          return res.status(500).json({ message: 'Erro ao salvar dados' });
        }

        res.json({
          message: 'Foto atualizada com sucesso.',
          foto: profissionais[index].foto,
          profissional: profissionais[index],
        });
      });
    });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});