import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom'; // For routing
import './index.css';
import App from './App';
import InvoicePrintPage from './InvoicePrintPage'; // Your print page component
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/print" element={<InvoicePrintPage />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} /> {/* Optional fallback */}
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

reportWebVitals();
