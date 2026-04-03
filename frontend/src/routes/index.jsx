import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import Login from '../containers/login.jsx'
import Inicio from '../containers/Inicio.jsx'
import Register from '../containers/Register.jsx'
import AdminDashboard from '../containers/Admin/Inicio.jsx'
import Dashboard from '../containers/Dashboard.jsx'
import StockMenu from '../containers/Admin/stock/CrearStock.jsx'
import SubirProducto from '../containers/Admin/stock/SubirProducto.jsx'
import VerProductos from '../containers/Admin/stock/VerProductos.jsx'
import Checkout from '../containers/Checkout.jsx'
import PagoExitoso from '../containers/PagoExitoso.jsx'
import PagoPendiente from '../containers/PagoPendiente.jsx'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  const hasSession = Boolean(user) || Boolean(token && storedUser)

  if (!hasSession) {
    return <Navigate to="/login" replace />
  }
  return children
}

function GuestRoute({ children }) {
  const { user } = useAuth()
  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  const hasSession = Boolean(user) || Boolean(token && storedUser)

  // Evita loops cuando queda token suelto sin usuario persistido.
  if (token && !storedUser && !user) {
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    localStorage.removeItem('nombre')
  }

  if (hasSession) {
    const role = Number(user?.rol ?? localStorage.getItem('rol'))
    return <Navigate to={role === 1 ? '/admin-dashboard' : '/dashboard'} replace />
  }
  return children
}

export default function AppRoutes() {
  const { user } = useAuth()
  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  const hasSession = Boolean(user) || Boolean(token && storedUser)
  const role = Number(user?.rol ?? localStorage.getItem('rol'))
  const defaultRoute = hasSession ? (role === 1 ? '/admin-dashboard' : '/dashboard') : '/login'

  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin-stock" element={<ProtectedRoute><StockMenu /></ProtectedRoute>} />
      <Route path="/admin-stock-upload" element={<ProtectedRoute><SubirProducto /></ProtectedRoute>} />
      <Route path="/admin-stock-views" element={<ProtectedRoute><VerProductos /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/pago-exitoso" element={<ProtectedRoute><PagoExitoso /></ProtectedRoute>} />
      <Route path="/pago-pendiente" element={<ProtectedRoute><PagoPendiente /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to={defaultRoute} replace />} />
      <Route path="*" element={<Navigate to={defaultRoute} replace />} />
    </Routes>
  )
}
