import { BrowserRouter } from 'react-router-dom';

import { Navbar } from './components';
import Routes from './Routes';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes></Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
