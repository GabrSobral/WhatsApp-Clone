import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { UsersProvider } from './contexts/UsersContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <UsersProvider>
        <App />
      </UsersProvider>   
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

