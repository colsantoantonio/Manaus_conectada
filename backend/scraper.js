const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');

const URL = 'https://g1.globo.com/am/amazonas/';
const cache = new NodeCache({ stdTTL: 300 }); // TTL de 300 segundos (5 minutos)

async function getNoticias() {
  const cacheKey = 'noticias_amazonas';

  // Verifica se já temos os dados no cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('✅ Retornando do cache');
    return cachedData;
  }

  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);
    const noticias = [];

    $('.feed-post-body').each((i, el) => {
      const titulo = $(el).find('.feed-post-link').text().trim();
      const link = $(el).find('.feed-post-link').attr('href');
      const resumo = $(el).find('.feed-post-body-resumo').text().trim();
      let imagem = $(el).parent().find('img').attr('src') || $(el).parent().find('img').attr('data-src');
      if (imagem && imagem.startsWith('//')) {
        imagem = 'https:' + imagem;
      }
      noticias.push({ titulo, link, resumo, imagem });
    });

    // Salva no cache
    cache.set(cacheKey, noticias);
    console.log('✅ Buscado do site e armazenado no cache');

    return noticias;

  } catch (error) {
    console.error('❌ Erro ao buscar notícias:', error.message);
    throw error;
  }
}

module.exports = getNoticias;
