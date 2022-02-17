import { Routes, Route } from 'react-router-dom';
import { Authenticate } from './pages/Authenticate';
import { Main } from './pages/Main/';
import { RoomsProvider } from './contexts/RoomsContext';

function App() {
  return (
    <Routes>
      <Route path="/Authenticate" element={<Authenticate/>}/>

      <Route path="/" element={
        <RoomsProvider>
          <Main/>
        </RoomsProvider>
      }/>
    </Routes>
  )
}

export default App
