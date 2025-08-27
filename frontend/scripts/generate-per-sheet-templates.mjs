import * as XLSX from 'xlsx'
import fs from 'node:fs'
import path from 'node:path'

const templates = {
  Departments: [['Code', 'Name'], ['IT', 'Information Technology']],
  Classes: [['Name', 'DepartmentCode', 'Year', 'Semester', 'Section'], ['IT-2-4-A', 'IT', '2', '4', 'A']],
  Students: [['RegNo', 'Name', 'Email', 'Class'], ['22IT001', 'Alice', 'alice@example.com', 'IT-2-4-A']],
  Staff: [['StaffId', 'Name', 'Email', 'DepartmentCode', 'Role', 'Password'], ['STF001', 'Staff One', 'staff1@example.com', 'IT', 'staff', 'Password1!']],
  Subjects: [['Code', 'Name', 'DepartmentCode'], ['IT401', 'Operating Systems', 'IT']],
  SubjectOfferings: [['Class', 'SubjectCode', 'StaffEmail'], ['IT-2-4-A', 'IT401', 'staff1@example.com']],
  Timetable: [['Class', 'Day', 'PeriodNo', 'SubjectCode', 'StaffEmail'], ['IT-2-4-A', 'Mon', '1', 'IT401', 'staff1@example.com']],
}

const pubDir = path.join(process.cwd(), 'public', 'templates')
fs.mkdirSync(pubDir, { recursive: true })

for (const [name, aoa] of Object.entries(templates)) {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(aoa)
  XLSX.utils.book_append_sheet(wb, ws, name)
  const out = path.join(pubDir, `${name}.xlsx`)
  XLSX.writeFile(wb, out)
  console.log('Wrote', out)
}

// Master template for convenience
const masterWb = XLSX.utils.book_new()
for (const [name, aoa] of Object.entries(templates)) {
  const ws = XLSX.utils.aoa_to_sheet(aoa)
  XLSX.utils.book_append_sheet(masterWb, ws, name)
}
const masterOut = path.join(process.cwd(), 'public', 'templates', 'admin-master-template.xlsx')
XLSX.writeFile(masterWb, masterOut)
console.log('Wrote', masterOut)



