import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MotoqueiroPage = () => {
  const [entregas, setEntregas] = useState([]);
  const [nome, setNome] = useState('');

  const carregarEntregas = async () => {
    const res = await axios.get('http://localhost:5000/api/entregas');
    setEntregas(res.data);
  };

  const aceitarEntrega = async (id) => {
    if (!nome) {
      alert('Digite seu nome!');
      return;
    }

    await axios.put(`http://localhost:5000/api/entregas/${id}/aceitar`, {
      motoqueiro: nome
    });

    carregarEntregas();
  };

  useEffect(() => {
    carregarEntregas();
  }, []);

  const pendentes = entregas.filter(e => e.status === 'pendente');

  return (
    <div style={{ padding: 20 }}>
      <h2>Motoqueiro</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Seu nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
      </div>

      <h3>Entregas Pendentes</h3>
      <ul>
        {pendentes.map(e => (
          <li key={e.id}>
            <strong>{e.pedido}</strong> - {e.endereco}
            <button
              onClick={() => aceitarEntrega(e.id)}
              style={{ marginLeft: 10 }}
            >
              Aceitar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MotoqueiroPage;
