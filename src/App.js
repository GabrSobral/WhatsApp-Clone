import React from 'react';
import './styles/global.css'
import Routes from './routes.js'
import { RoomProvider } from './context/roomContext.js'

export default function App() {


  return (
    <div className="App">
      <div className='app-body'>
        <RoomProvider>

          <Routes />

        </RoomProvider>   
      </div>
    </div>
  );
}
