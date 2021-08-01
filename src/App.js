import React from 'react';
import { UsersProvider } from './contexts/UsersContext.js';
import Routes from './routes.js'
import './styles/global.scss'

export default function App() {
  return (
    <div className="App">
      <UsersProvider>
        <Routes />
      </UsersProvider>
    </div>
  );
}
