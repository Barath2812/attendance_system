import { useEffect, useState } from 'react'
import { api } from '../../lib/axios'
import { Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout.jsx'
import { Card } from '../../components/ui'

export default function StaffDashboard() {
  const [classes, setClasses] = useState([])
  const [todayPeriods, setTodayPeriods] = useState([])

  useEffect(() => {
    async function load() {
      const { data: cls } = await api.get('/staff/classes')
      setClasses(cls)
      if (cls.length > 0) {
        const { data: tts } = await api.get(`/timetable/class/${cls[0]._id}`)
        const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()]
        const today = tts.find((t) => t.day === day)
        setTodayPeriods(today ? today.periods : [])
      }
    }
    load()
  }, [])

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Staff Dashboard</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
          <h2 className="font-medium mb-2">My Classes</h2>
          <ul className="space-y-2">
            {classes.map((c) => (
              <li key={c._id} className="flex items-center justify-between border rounded p-2">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">Year {c.year}, Sem {c.semester} • Section {c.section}</div>
                </div>
                <div className="space-x-2">
                  <Link className="text-green-600" to={`/staff/mark?classId=${c._id}`}>Mark</Link>
                </div>
              </li>
            ))}
          </ul>
          </Card>
          <Card className="p-4">
          <h2 className="font-medium mb-2">Today&apos;s Periods</h2>
          <ul className="space-y-2">
            {todayPeriods.map((p) => (
              <li key={p.periodNo} className="border rounded p-2 flex items-center justify-between">
                <span>Period {p.periodNo}</span>
                <Link className="text-green-600" to={`/staff/mark?subjectId=${p.subjectId}&classId=${p.classId}&period=${p.periodNo}`}>Mark</Link>
              </li>
            ))}
          </ul>
          </Card>
        </div>
      </div>
    </Layout>
  )
}


