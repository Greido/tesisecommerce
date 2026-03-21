import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../containers/login.jsx'
import Inicio from '../containers/Inicio.jsx'
import Register from '../containers/Register.jsx'
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
