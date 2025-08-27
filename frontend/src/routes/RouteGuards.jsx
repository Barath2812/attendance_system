import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  return children
}

export function RoleRoute({ role, children }) {
  const { user } = useAuth()
  if (!user || user.role !== role) return <Navigate to="/" replace />
  return children
}


