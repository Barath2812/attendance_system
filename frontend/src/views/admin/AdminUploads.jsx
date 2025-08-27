import Layout from '../../components/layout/Layout.jsx'
import { Button, Card, CardBody } from '../../components/ui'
import { useState } from 'react'
import { api } from '../../lib/axios'
import toast from 'react-hot-toast'

export default function AdminUploads() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const uploadMaster = async () => {
    if (!file) return toast.error('Select a file')
    const form = new FormData()
    form.append('file', file)
    try {
      setLoading(true)
      await api.post('/import/excel', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Master import completed')
    } catch (e) {
      toast.error('Import failed')
    } finally {
      setLoading(false)
    }
  }

  const uploadSheet = async (name, file) => {
    if (!file) return toast.error('Choose a file for ' + name)
    const form = new FormData()
    form.append('file', file)
    await api.post(`/import/sheet/${name}`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
    toast.success(`${name} imported`)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Admin: Upload Master Data</h1>
        <Card>
          <CardBody className="space-y-4">
            <div className="text-sm text-gray-600">
              Upload the multi-sheet Excel (Classes, Students, Staff, Subjects, Timetable).
            </div>
            <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="flex gap-3">
              <Button onClick={uploadMaster} disabled={loading}>{loading ? 'Uploading...' : 'Upload master file'}</Button>
              <a className="text-blue-600 hover:underline text-sm" href="/templates/admin-master-template.xlsx" download>Download master template</a>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <div className="font-medium">Upload individual sheets</div>
            <div className="grid md:grid-cols-2 gap-4">
              {['Departments','Classes','Students','Staff','Subjects','SubjectOfferings','Timetable'].map((name) => (
                <div key={name} className="border rounded p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{name}</div>
                    <a className="text-blue-600 hover:underline text-xs" href={`/templates/${name}.xlsx`} download>Download {name} template</a>
                  </div>
                  <label className="text-sm cursor-pointer">
                    <input className="hidden" type="file" accept=".xlsx,.xls" onChange={async (e) => {
                      const f = e.target.files?.[0]
                      if (f) await uploadSheet(name, f)
                      e.target.value = ''
                    }} />
                    <span className="border rounded px-3 py-1">Upload</span>
                  </label>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  )
}


