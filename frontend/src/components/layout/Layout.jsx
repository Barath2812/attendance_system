import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  )
}


