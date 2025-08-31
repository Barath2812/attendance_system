import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the existing Classes.xlsx file
const templatePath = path.join(__dirname, '../public/templates/Classes.xlsx');
const workbook = XLSX.readFile(templatePath);

// Get the first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert to JSON to see current structure
const currentData = XLSX.utils.sheet_to_json(sheet);

console.log('Current Classes data:', currentData);

// Add capacity column to existing data
const updatedData = currentData.map(row => ({
  ...row,
  Capacity: row.Capacity || 50 // Default capacity of 50 if not specified
}));

// Create new workbook with updated data
const newWorkbook = XLSX.utils.book_new();
const newSheet = XLSX.utils.json_to_sheet(updatedData);

// Set column headers explicitly
const headers = ['Name', 'DepartmentCode', 'Year', 'Semester', 'Section', 'Capacity'];
XLSX.utils.sheet_add_aoa(newSheet, [headers], { origin: 'A1' });

// Add the updated data starting from row 2
XLSX.utils.sheet_add_json(newSheet, updatedData, { origin: 'A2', skipHeader: true });

// Add the sheet to the workbook
XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Classes');

// Write the updated file
const outputPath = path.join(__dirname, '../public/templates/Classes-with-capacity.xlsx');
XLSX.writeFile(newWorkbook, outputPath);

console.log('Updated Classes template created with capacity column!');
console.log('New file:', outputPath);
console.log('Updated data:', updatedData);
