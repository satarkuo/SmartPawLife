import { StrictMode } from 'react'
import App from './App'
import { createRoot } from 'react-dom/client'

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/all.scss';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
