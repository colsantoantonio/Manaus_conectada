import { BrowserRouter } from 'react-router-dom';
import RoutesApp from './Routes';
import Header from './Components/Header';
import Footer from './Components/Footer/Footer';
import ModalBoasVindas from './Components/Modal/boasvindas';

export default function App() {
  return (
    <BrowserRouter>
      <ModalBoasVindas />
      <Header />
      <RoutesApp />
      <Footer />
    </BrowserRouter>
  );
}


