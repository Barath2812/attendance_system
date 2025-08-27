import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

function NavItem({ to, children }) {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link to={to} className={`block px-3 py-2 rounded-lg transition ${active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
      {children}
    </Link>
  )
}

export default function Sidebar() {
  const { user } = useAuth()
  if (!user) return null
  return (
    <aside className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-3 h-fit sticky top-6">
      <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Menu</div>
      <nav className="space-y-1.5">
        {user.role === 'admin' && (
          <>
            <NavItem to="/admin/uploads">Uploads</NavItem>
          </>
        )}
        {user.role === 'staff' && (
          <>
            <NavItem to="/staff">Dashboard</NavItem>
            <NavItem to="/staff/mark">Mark Attendance</NavItem>
          </>
        )}
        {user.role === 'counsellor' && (
          <>
            <NavItem to="/counsellor">Dashboard</NavItem>
            <NavItem to="/admin/uploads">Upload Master Data</NavItem>
          </>
        )}
      </nav>
    </aside>
  )
}


