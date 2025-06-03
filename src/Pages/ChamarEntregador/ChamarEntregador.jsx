import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MercadoPage = () => {
  const [entregas, setEntregas] = useState([]);
  const [pedido, setPedido] = useState('');
  const [endereco, setEndereco] = useState('');

  const carregarEntregas = async () => {
    const res = await axios.get('http://localhost:5000/api/entregas');
    setEntregas(res.data);
  };

  const criarEntrega = async () => {
    await axios.post('http://localhost:5000/api/entregas', {
      pedido,
      endereco,
      cliente: 'Mercado Central'
    });
    setPedido('');
    setEndereco('');
    carregarEntregas();
  };

  useEffect(() => {
    carregarEntregas();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Dono do Mercado</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Pedido"
          value={pedido}
          onChange={e => setPedido(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          placeholder="Endereço"
          value={endereco}
          onChange={e => setEndereco(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button onClick={criarEntrega}>Criar Entrega</button>
      </div>

      <h3>Entregas</h3>
      <ul>
        {entregas.map(e => (
          <li key={e.id}>
            <strong>{e.pedido}</strong> - {e.endereco} - <em>{e.status}</em>
            {e.motoqueiro && <> | Motoqueiro: {e.motoqueiro}</>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MercadoPage;
