import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link to={user?.role === 'admin' ? '/admin/uploads' : user?.role === 'counsellor' ? '/counsellor' : user?.role === 'student' ? '/student' : '/staff'} className="font-semibold tracking-tight">Campus Attendance</Link>
        <div className="flex items-center gap-3">
          {user && <span className="text-sm text-gray-600">{user.name} ({user.role})</span>}
          {user && (
            <button onClick={logout} className="text-sm border rounded-lg px-3 py-1 hover:bg-gray-50">Logout</button>
          )}
        </div>
      </div>
    </header>
  )
}


