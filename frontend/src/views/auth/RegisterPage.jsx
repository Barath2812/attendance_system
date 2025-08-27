import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/axios'
import toast from 'react-hot-toast'
import { Input, Select, Button, Card, CardBody } from '../../components/ui'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('staff')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/register', { name, email, password, role })
      toast.success('Registered')
      navigate('/')
    } catch (e) {
      toast.error('Registration failed')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.05),transparent_35%)]" />
        <div className="relative h-full flex items-center justify-center p-10">
          <div className="max-w-md text-white/90">
            <div className="text-3xl font-semibold">Create your account</div>
            <p className="mt-3 text-white/70">Join your campus and start tracking attendance with ease.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-10">
        <Card className="w-full max-w-md">
          <CardBody className="space-y-5">
            <div>
              <div className="text-2xl font-semibold">Register</div>
              <div className="text-sm text-gray-500">Create a new account</div>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="staff">Staff</option>
                <option value="counsellor">Counsellor</option>
                <option value="admin">Admin</option>
              </Select>
              <Button className="w-full">Register</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}


