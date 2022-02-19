import { Routes, Route } from 'react-router-dom';
import { Authenticate } from './pages/Authenticate';
import { Main } from './pages/Main/';
import { RoomsProvider } from './contexts/RoomsContext';
import { SocketProvider } from './contexts/SocketContext';

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
