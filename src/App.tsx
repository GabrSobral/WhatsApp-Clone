import { Routes, Route } from 'react-router-dom';
import { Authenticate } from './pages/Authenticate';
import { initDB } from 'react-indexed-db';

import { Main } from './pages/Main/';
import { RoomsProvider } from './contexts/RoomsContext';
import { SocketProvider } from './contexts/SocketContext';

import { DBConfig } from './services/DBConfig';

initDB(DBConfig);

function App() {
  return (
    <Routes>
      <Route path="/Authenticate" element={<Authenticate/>}/>

      <Route path="/" element={
        <SocketProvider>
          <RoomsProvider>
            <Main/>
          </RoomsProvider>
        </SocketProvider>
      }/>
    </Routes>
  )
}

export default App
