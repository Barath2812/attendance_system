import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'
import { StaffRoutes, CounsellorRoutes, AdminRoutes } from './routes/AppRoutes.jsx'

const router = createBrowserRouter([
  ...StaffRoutes,
  ...CounsellorRoutes,
  ...AdminRoutes,
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AuthProvider>
  </StrictMode>,
)
