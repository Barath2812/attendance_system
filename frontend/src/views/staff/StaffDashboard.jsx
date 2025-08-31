import { useEffect, useState } from 'react'
import { api } from '../../lib/axios'
import { Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout.jsx'
import { Card, Button } from '../../components/ui'
import toast from 'react-hot-toast'

export default function StaffDashboard() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStaffClasses()
  }, [])

  const loadStaffClasses = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/staff/classes')
      setClasses(data)
      if (data.length > 0) {
        setSelectedClass(data[0])
        await loadClassDetails(data[0].id)
      }
    } catch (error) {
      console.error('Error loading classes:', error)
      toast.error('Failed to load classes')
    } finally {
      setLoading(false)
    }
  }

  const loadClassDetails = async (classId) => {
    try {
      // Load students in the class
      const { data: studentsData } = await api.get(`/classes/${classId}/students`)
      setStudents(studentsData)

      // Load subjects for this class
      const { data: subjectsData } = await api.get(`/staff/class/${classId}/subjects`)
      setSubjects(subjectsData)
    } catch (error) {
      console.error('Error loading class details:', error)
      toast.error('Failed to load class details')
    }
  }

  const handleClassChange = async (classData) => {
    setSelectedClass(classData)
    await loadClassDetails(classData.id)
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
          <h1 className="text-2xl font-semibold">Staff Dashboard</h1>
          <div className="text-sm text-gray-600">
            Welcome back! Here are your assigned classes and students.
          </div>
        </div>

        {/* Class Selection */}
        <Card className="p-4">
          <h2 className="font-medium mb-4">Select Class</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedClass?.id === cls.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleClassChange(cls)}
              >
                <div className="font-medium text-lg">{cls.name}</div>
                <div className="text-sm text-gray-600">
                  Year {cls.year}, Semester {cls.semester} • Section {cls.section}
                </div>
                {cls.department && (
                  <div className="text-xs text-gray-500 mt-1">
                    Department: {cls.department.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {selectedClass && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Students List */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Students in {selectedClass.name}</h2>
                <span className="text-sm text-gray-600">{students.length} students</span>
              </div>
              
              {students.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-600">ID: {student.id}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/staff/mark?classId=${selectedClass.id}&studentId=${student.id}`}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                          Mark Attendance
                        </Link>
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

            {/* Subjects and Quick Actions */}
            <Card className="p-4">
              <h2 className="font-medium mb-4">Subjects & Quick Actions</h2>
              
              {subjects.length > 0 ? (
                <div className="space-y-4">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{subject.name}</div>
                          <div className="text-sm text-gray-600">Code: {subject.code}</div>
                        </div>
                        <Link
                          to={`/staff/mark?classId=${selectedClass.id}&subjectId=${subject.id}`}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                          Mark Attendance
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No subjects assigned to this class
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-6 pt-4 border-t">
                <h3 className="font-medium mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link
                    to={`/staff/mark?classId=${selectedClass.id}`}
                    className="block w-full px-4 py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600 transition-colors"
                  >
                    Mark Attendance for All Students
                  </Link>
                  <Link
                    to={`/staff/subject/${selectedClass.id}`}
                    className="block w-full px-4 py-2 bg-gray-500 text-white text-center rounded hover:bg-gray-600 transition-colors"
                  >
                    View Attendance History
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}

        {classes.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
              <div className="text-xl font-medium mb-2">No Classes Assigned</div>
              <div className="text-sm">
                You haven't been assigned to any classes yet. Please contact your administrator.
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  )
}


