import * as XLSX from 'xlsx'
import path from 'node:path'

function aoaToSheet(aoa) {
  const ws = XLSX.utils.aoa_to_sheet(aoa)
  return ws
}

const wb = XLSX.utils.book_new()

// Classes sheet
XLSX.utils.book_append_sheet(
  wb,
  aoaToSheet([
    ['Name', 'DepartmentCode', 'CounsellorStaffEmail', 'Year', 'Section'],
    ['CSE-A', 'CSE', 'counsellor@example.com', '3', 'A'],
  ]),
  'Classes'
)

// Students sheet
XLSX.utils.book_append_sheet(
  wb,
  aoaToSheet([
    ['RegNo', 'Name', 'Email', 'Class'],
    ['22CSE001', 'Alice', 'alice@example.com', 'CSE-A'],
    ['22CSE002', 'Bob', 'bob@example.com', 'CSE-A'],
  ]),
  'Students'
)

// Staff sheet
XLSX.utils.book_append_sheet(
  wb,
  aoaToSheet([
    ['StaffId', 'Name', 'Email', 'DepartmentCode', 'Role', 'Password', 'Class'],
    ['STF001', 'Counsellor', 'counsellor@example.com', 'CSE', 'counsellor', 'Password1!', 'CSE-A'],
    ['STF002', 'Staff One', 'staff1@example.com', 'CSE', 'staff', 'Password1!', ''],
    ['ADMIN', 'Admin', 'admin@example.com', 'CSE', 'admin', 'Password1!', ''],
  ]),
  'Staff'
)

// Subjects sheet
XLSX.utils.book_append_sheet(
  wb,
  aoaToSheet([
    ['Code', 'Name', 'DepartmentCode', 'Class', 'StaffEmail'],
    ['MA301', 'Mathematics', 'CSE', 'CSE-A', 'staff1@example.com'],
    ['PH301', 'Physics', 'CSE', 'CSE-A', 'staff1@example.com'],
  ]),
  'Subjects'
)

// Timetable sheet
XLSX.utils.book_append_sheet(
  wb,
  aoaToSheet([
    ['Class', 'Day', 'PeriodNo', 'SubjectCode', 'StaffEmail'],
    ['CSE-A', 'Mon', '1', 'MA301', 'staff1@example.com'],
    ['CSE-A', 'Mon', '2', 'PH301', 'staff1@example.com'],
  ]),
  'Timetable'
)

const outPath = path.join(process.cwd(), 'admin-master-template.xlsx')
XLSX.writeFile(wb, outPath)
console.log(`Wrote: ${outPath}`)


