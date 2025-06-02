import { Routes, Route } from 'react-router-dom';

import Home from '../Pages/Home';
import Sobre from '../Pages/Sobre';
import Contato from '../Pages/Contato';
import Mercadao from '../Pages/Mercadao';
import Informações from '../Pages/Noticias';
import Serviços from '../Pages/Serviços';
import ProducingRoute from '../Components/Produção/indexRoute';

function RoutesApp() {
    return (
        <Routes>
            <Route path='/' element={<ProducingRoute ativo={false}><Home /></ProducingRoute>} />
            <Route path='/sobre' element={<ProducingRoute ativo={true}><Sobre /></ProducingRoute>} />
            <Route path='/contato' element={<ProducingRoute ativo={false}><Contato /></ProducingRoute>} />
            <Route path='/mercadao' element={<ProducingRoute ativo={false}><Mercadao /></ProducingRoute>} />
            <Route path='/informações' element={<ProducingRoute ativo={false}><Informações /></ProducingRoute>} />
            <Route path='/serviços' element={<ProducingRoute ativo={false}><Serviços /></ProducingRoute>} />
        </Routes>
    );
}

export default RoutesApp;
