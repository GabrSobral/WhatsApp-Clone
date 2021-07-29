import React from 'react';
import './styles/global.scss'
import Routes from './routes.js'
import { RoomProvider } from './contexts/roomContext.js'

export default function App() {
  return (
    <div className="App">
      <RoomProvider>
        <Routes />
      </RoomProvider>   
    </div>
  );
}
