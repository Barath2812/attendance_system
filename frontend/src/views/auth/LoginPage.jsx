import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Input, Button, Card, CardBody } from '../../components/ui'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('counsellor@example.com')
  const [password, setPassword] = useState('Password1!')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await login(email, password)
      toast.success('Logged in')
      const role = JSON.parse(localStorage.getItem('user')).role
      navigate(role === 'admin' ? '/admin/uploads' : role === 'staff' ? '/staff' : '/counsellor')
    } catch (e) {
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.05),transparent_35%)]" />
        <div className="relative h-full flex items-center justify-center p-10">
          <div className="max-w-md text-white/90">
            <div className="text-3xl font-semibold">Campus Attendance</div>
            <p className="mt-3 text-white/70">Simple, fast, and reliable attendance tracking for your campus.</p>
            <div className="mt-10 grid grid-cols-3 gap-3 text-sm">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="font-medium">Secure</div>
                <div className="text-white/70">Role-based access</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="font-medium">Insights</div>
                <div className="text-white/70">Visual dashboards</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="font-medium">Export</div>
                <div className="text-white/70">Excel reports</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-10">
        <Card className="w-full max-w-md">
          <CardBody className="space-y-5">
            <div>
              <div className="text-2xl font-semibold">Welcome back</div>
              <div className="text-sm text-gray-500">Login to your account</div>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button disabled={loading} className="w-full">{loading ? 'Logging in...' : 'Login'}</Button>
            </form>
            <p className="text-xs text-gray-500">Use counsellor@example.com or alice@example.com / Password1!</p>
            <div className="text-sm text-center text-gray-600">
              Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}


