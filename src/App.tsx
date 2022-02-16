import { Routes, Route } from 'react-router-dom';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Main } from './pages/Main/';
import { RoomsProvider } from './contexts/RoomsContext';

function App() {
  return (
    <Routes>
      <Route path="/SignIn" element={<SignIn/>}/>
      <Route path="/SignUp" element={<SignUp/>}/>
      <Route path="/" element={
        <RoomsProvider>
          <Main/>
        </RoomsProvider>
      }/>
    </Routes>
  )
}

export default App
