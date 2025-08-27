import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../lib/axios'
import toast from 'react-hot-toast'
import Layout from '../../components/layout/Layout.jsx'
import { Button, Input, Select } from '../../components/ui'

export default function MarkAttendance() {
  const [params] = useSearchParams()
  const [subjectId, setSubjectId] = useState(params.get('subjectId') || '')
  const classId = params.get('classId')
  const defaultPeriod = Number(params.get('period') || 1)
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [period, setPeriod] = useState(defaultPeriod)
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10))
  const [statusMap, setStatusMap] = useState({})

  useEffect(() => {
    async function load() {
      if (!classId) return
      const { data } = await api.get(`/classes/${classId}/students`)
      setStudents(data)
    }
    load()
  }, [classId])

  useEffect(() => {
    async function loadSubjects() {
      if (!classId) return
      const { data } = await api.get(`/staff/class/${classId}/subjects`)
      setSubjects(data)
      if (data?.[0]?._id && !subjectId) setSubjectId(data[0]._id)
    }
    loadSubjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId])

  const toggle = (id) => {
    setStatusMap((m) => ({ ...m, [id]: m[id] === 'Present' ? 'Absent' : 'Present' }))
  }

  const submit = async () => {
    const records = students.map((s) => ({ studentId: s._id, status: statusMap[s._id] || 'Present' }))
    try {
      await api.post('/attendance/mark', { date, period, classId, subjectId, records })
      toast.success('Attendance saved')
    } catch {
      toast.error('Failed to save')
    }
  }

  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Mark Attendance</h1>
        <div className="flex gap-2 items-center">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input className="w-24" type="number" min={1} value={period} onChange={(e) => setPeriod(Number(e.target.value))} />
          <Select className="w-56" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </Select>
          <Button onClick={submit}>Save</Button>
        </div>
        <div className="grid md:grid-cols-2 gap-2">
        {students.map((s) => (
          <div key={s._id} className="border rounded p-3 flex items-center justify-between">
            <span>{s.name}</span>
            <button onClick={() => toggle(s._id)} className={`px-3 py-1 rounded ${statusMap[s._id] === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {statusMap[s._id] === 'Absent' ? 'Absent' : 'Present'}
            </button>
          </div>
        ))}
        </div>
      </div>
    </Layout>
  )
}


