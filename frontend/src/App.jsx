import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PanelCliente from './pages/PanelCliente';
import CrearReserva from './pages/CrearReserva';
import MisReservas from './pages/MisReservas';
import MenuDiario from './pages/MenuDiario';
import AdminReservas from './pages/AdminReservas';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PanelCliente />} />
        <Route path="/reservar" element={<CrearReserva />} />
        <Route path="/mis-reservas" element={<MisReservas />} />
        <Route path="/menu" element={<MenuDiario />} />
        <Route path="/admin" element={<AdminReservas />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
