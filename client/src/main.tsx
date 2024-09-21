import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { SocketProvider } from './context/SocketProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SocketProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </SocketProvider>
)
