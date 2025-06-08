 // src/Components/RotaPrivada.jsx
import { Navigate } from 'react-router-dom';

function RotaPrivada({ children }) {
    const logado = localStorage.getItem('usuarioLogado') === 'true';

    if (!logado) {
        return <Navigate to="/logincomercio" replace />;
    }

    return children;
}

export default RotaPrivada;
