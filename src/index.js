import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import ProtectedRoute from './ProtectedRoute';
import InvoicePrintPage from './InvoicePrintPage'; // ✅ Import this new page

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/print" element={<InvoicePrintPage />} /> {/* ✅ Add this route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
);
