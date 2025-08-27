import fs from 'node:fs'
import path from 'node:path'
import * as XLSX from 'xlsx'

// Generate sample attendance records matching the app's expected columns
// Columns: date, period, student, subject, status

const today = new Date()
const dateStr = today.toISOString().slice(0, 10)

const sample = []
for (let i = 1; i <= 10; i++) {
  sample.push({
    date: dateStr,
    period: (i % 6) + 1,
    student: `Student ${i}`,
    subject: i % 2 === 0 ? 'Mathematics' : 'Physics',
    status: i % 4 === 0 ? 'Absent' : 'Present',
  })
}

const ws = XLSX.utils.json_to_sheet(sample)
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, 'Attendance')

const outDir = path.resolve(process.cwd())
const outPath = path.join(outDir, 'sample-attendance.xlsx')
XLSX.writeFile(wb, outPath)

console.log(`Wrote: ${outPath}`)


