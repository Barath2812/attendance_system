import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../lib/axios'
import Layout from '../../components/layout/Layout.jsx'
import { Card } from '../../components/ui'

export default function SubjectHistory() {
  const { id } = useParams()
  const [records, setRecords] = useState([])

  useEffect(() => {
    async function load() {
      const { data } = await api.get(`/attendance/subject/${id}`)
      setRecords(data)
    }
    load()
  }, [id])

  return (
    <Layout>
      <h1 className="text-xl font-semibold mb-4">Subject Attendance</h1>
      <Card className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Period</th>
              <th className="p-2">Student</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
                <td className="p-2">{r.period}</td>
                <td className="p-2">{r.studentId?.name}</td>
                <td className="p-2">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Layout>
  )
}


