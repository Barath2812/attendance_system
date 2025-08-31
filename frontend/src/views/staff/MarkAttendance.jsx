import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../../lib/axios'
import toast from 'react-hot-toast'
import Layout from '../../components/layout/Layout.jsx'
import { Button, Input, Select, Card } from '../../components/ui'

export default function MarkAttendance() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [subjectId, setSubjectId] = useState(params.get('subjectId') || '')
  const [classId, setClassId] = useState(params.get('classId') || '')
  const [studentId, setStudentId] = useState(params.get('studentId') || '')
  const defaultPeriod = Number(params.get('period') || 1)
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [period, setPeriod] = useState(defaultPeriod)
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10))
  const [statusMap, setStatusMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [classId])

  const loadData = async () => {
    if (!classId) return
    
    try {
      setLoading(true)
      
      // Load class details
      const { data: classData } = await api.get(`/classes/${classId}`)
      setSelectedClass(classData)
      
      // Load students
      const { data: studentsData } = await api.get(`/classes/${classId}/students`)
      setStudents(studentsData)
      
      // Initialize status map with all students as present
      const initialStatus = {}
      studentsData.forEach(student => {
        initialStatus[student.id] = 'Present'
      })
      setStatusMap(initialStatus)
      
      // Load subjects
      const { data: subjectsData } = await api.get(`/staff/class/${classId}/subjects`)
      setSubjects(subjectsData)
      if (subjectsData?.[0]?.id && !subjectId) {
        setSubjectId(subjectsData[0].id)
      }
      
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load class data')
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = (studentId) => {
    setStatusMap(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }))
  }

  const markAllPresent = () => {
    const allPresent = {}
    students.forEach(student => {
      allPresent[student.id] = 'Present'
    })
    setStatusMap(allPresent)
  }

  const markAllAbsent = () => {
    const allAbsent = {}
    students.forEach(student => {
      allAbsent[student.id] = 'Absent'
    })
    setStatusMap(allAbsent)
  }

  const submitAttendance = async () => {
    if (!subjectId) {
      toast.error('Please select a subject')
      return
    }
    
    if (students.length === 0) {
      toast.error('No students to mark attendance for')
      return
    }

    try {
      setSubmitting(true)
      
      const records = students.map(student => ({
        studentId: student.id,
        status: statusMap[student.id] || 'Present'
      }))

      await api.post('/attendance/mark', {
        date,
        period,
        classId,
        subjectId,
        records
      })
      
      toast.success('Attendance marked successfully!')
      navigate('/staff')
      
    } catch (error) {
      console.error('Error marking attendance:', error)
      toast.error('Failed to mark attendance')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Mark Attendance</h1>
            {selectedClass && (
              <p className="text-gray-600">Class: {selectedClass.name}</p>
            )}
          </div>
          <Button
            onClick={() => navigate('/staff')}
            className="bg-gray-500 hover:bg-gray-600"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Configuration Panel */}
        <Card className="p-4">
          <h2 className="font-medium mb-4">Attendance Configuration</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <Input
                type="number"
                min={1}
                max={8}
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <Select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={submitAttendance}
                disabled={submitting || !subjectId}
                className="w-full"
              >
                {submitting ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Students List */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Students ({students.length})</h2>
            <div className="flex space-x-2">
              <Button
                onClick={markAllPresent}
                className="bg-green-500 hover:bg-green-600 text-sm"
              >
                Mark All Present
              </Button>
              <Button
                onClick={markAllAbsent}
                className="bg-red-500 hover:bg-red-600 text-sm"
              >
                Mark All Absent
              </Button>
            </div>
          </div>

          {students.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-600">ID: {student.id}</div>
                    </div>
                    <button
                      onClick={() => toggleStatus(student.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        statusMap[student.id] === 'Absent'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {statusMap[student.id] === 'Absent' ? 'Absent' : 'Present'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No students found in this class
            </div>
          )}
        </Card>

        {/* Summary */}
        {students.length > 0 && (
          <Card className="p-4">
            <h3 className="font-medium mb-3">Attendance Summary</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {students.filter(s => statusMap[s.id] === 'Present').length}
                </div>
                <div className="text-sm text-green-700">Present</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {students.filter(s => statusMap[s.id] === 'Absent').length}
                </div>
                <div className="text-sm text-red-700">Absent</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {students.length}
                </div>
                <div className="text-sm text-blue-700">Total</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  )
}


