import { useEffect, useMemo, useState } from 'react'
import { api } from '../../lib/axios'
import Layout from '../../components/layout/Layout.jsx'
import { Card, Select, Button } from '../../components/ui'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'

export default function CounsellorDashboard() {
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [attendance, setAttendance] = useState([])
  const [classId, setClassId] = useState('')
  const [subjectId, setSubjectId] = useState('')

  useEffect(() => {
    async function loadBase() {
      const { data: cls } = await api.get('/staff/classes')
      setClasses(cls)
      if (cls[0]) setClassId(cls[0]._id)
    }
    loadBase()
  }, [])

  useEffect(() => {
    async function loadSubjects() {
      if (!classId) return
      const { data: subs } = await api.get(`/staff/class/${classId}/subjects`)
      setSubjects(subs)
      if (subs[0]) setSubjectId(subs[0]._id)
    }
    loadSubjects()
  }, [classId])

  useEffect(() => {
    async function loadAttendance() {
      if (!classId) return
      const { data } = await api.get(`/attendance/class/${classId}`)
      setAttendance(data)
    }
    loadAttendance()
  }, [classId])

  const stats = useMemo(() => {
    const byStudent = {}
    const bySubject = {}
    const byClass = { present: 0, total: 0 }
    attendance.forEach((r) => {
      byClass.total += 1
      if (r.status === 'Present') byClass.present += 1
      const sid = r.studentId?._id || r.studentId
      byStudent[sid] = byStudent[sid] || { name: r.studentId?.name || sid, present: 0, total: 0 }
      byStudent[sid].total += 1
      if (r.status === 'Present') byStudent[sid].present += 1
      const sub = r.subjectId?._id || r.subjectId
      bySubject[sub] = bySubject[sub] || { name: r.subjectId?.name || sub, present: 0, total: 0 }
      bySubject[sub].total += 1
      if (r.status === 'Present') bySubject[sub].present += 1
    })
    const studentData = Object.values(byStudent).map((s) => ({ name: s.name, percent: s.total ? Math.round((s.present / s.total) * 100) : 0 }))
    const subjectData = Object.values(bySubject).map((s) => ({ name: s.name, percent: s.total ? Math.round((s.present / s.total) * 100) : 0 }))
    const classPercent = byClass.total ? Math.round((byClass.present / byClass.total) * 100) : 0
    return { studentData, subjectData, classPercent }
  }, [attendance])

  const exportExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(attendance.map((r) => ({
        date: new Date(r.date).toLocaleDateString(),
        period: r.period,
        student: r.studentId?.name,
        subject: r.subjectId?.name,
        status: r.status,
      })))
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance')
      XLSX.writeFile(wb, 'attendance.xlsx')
      toast.success('Exported attendance.xlsx')
    } catch {
      toast.error('Export failed')
    }
  }

  const importFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    try {
      await api.post('/import/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Imported successfully')
      // refresh
      const { data } = await api.get(`/attendance/class/${classId}`)
      setAttendance(data)
    } catch {
      toast.error('Import failed')
    }
  }

  const COLORS = ['#22c55e', '#ef4444']

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Counsellor Dashboard</h1>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-sm text-gray-600">Class</label>
            <Select value={classId} onChange={(e) => setClassId(e.target.value)}>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Subject</label>
            <Select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
            </Select>
          </div>
          <Button onClick={exportExcel}>Export Excel</Button>
          <label className="border rounded px-4 py-2 cursor-pointer bg-white">
          Upload Excel
          <input onChange={importFile} className="hidden" type="file" accept=".xlsx,.xls" />
        </label>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-4">
          <h2 className="font-medium mb-3">Class Attendance %</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie dataKey="value" data={[{ name: 'Present', value: stats.classPercent }, { name: 'Absent', value: 100 - stats.classPercent }]} cx="50%" cy="50%" outerRadius={80} label>
                {[stats.classPercent, 100 - stats.classPercent].map((_, i) => (
                  <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          </Card>
          <Card className="p-4 lg:col-span-2">
          <h2 className="font-medium mb-3">Student-wise %</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.studentData}>
              <XAxis dataKey="name" hide />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="percent" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
          </Card>
          <Card className="p-4 lg:col-span-3">
          <h2 className="font-medium mb-3">Subject-wise %</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.subjectData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="percent" stroke="#16a34a" />
            </LineChart>
          </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </Layout>
  )
}


