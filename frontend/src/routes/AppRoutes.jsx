import LoginPage from '../views/auth/LoginPage.jsx'
import RegisterPage from '../views/auth/RegisterPage.jsx'
import StaffDashboard from '../views/staff/StaffDashboard.jsx'
import MarkAttendance from '../views/staff/MarkAttendance.jsx'
import SubjectHistory from '../views/staff/SubjectHistory.jsx'
import CounsellorDashboard from '../views/counsellor/CounsellorDashboard.jsx'
import StudentDashboard from '../views/student/StudentDashboard.jsx'
import { ProtectedRoute, RoleRoute } from './RouteGuards.jsx'
import AdminUploads from '../views/admin/AdminUploads.jsx'

export const StaffRoutes = [
  { path: '/', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/staff',
    element: (
      <ProtectedRoute>
        <RoleRoute role="staff">
          <StaffDashboard />
        </RoleRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff/mark',
    element: (
      <ProtectedRoute>
        <RoleRoute role="staff">
          <MarkAttendance />
        </RoleRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: '/staff/subject/:id',
    element: (
      <ProtectedRoute>
        <RoleRoute role="staff">
          <SubjectHistory />
        </RoleRoute>
      </ProtectedRoute>
    ),
  },
]

export const CounsellorRoutes = [
  {
    path: '/counsellor',
    element: (
      <ProtectedRoute>
        <RoleRoute role="counsellor">
          <CounsellorDashboard />
        </RoleRoute>
      </ProtectedRoute>
    ),
  },
]

export const StudentRoutes = [
  {
    path: '/student',
    element: (
      <ProtectedRoute>
        <RoleRoute role="student">
          <StudentDashboard />
        </RoleRoute>
      </ProtectedRoute>
    ),
  },
]

export const AdminRoutes = [
  {
    path: '/admin/uploads',
    element: (
      <ProtectedRoute>
        <RoleRoute role="admin">
          <AdminUploads />
        </RoleRoute>
      </ProtectedRoute>
    ),
  },
]


