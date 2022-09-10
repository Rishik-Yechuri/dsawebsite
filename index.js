import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './navbarcss.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
ReactDOM.render(
  <React.StrictMode>
      <script crossOrigin src="https://unpkg.com/universal-cookie@3/umd/universalCookie.min.js"></script>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
