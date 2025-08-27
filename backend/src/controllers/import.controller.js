const XLSX = require('xlsx');
const User = require('../models/User.model');
const ClassModel = require('../models/Class.model');
const Subject = require('../models/Subject.model');
const Timetable = require('../models/Timetable.model');

function sheetToJson(workbook, name) {
  const sheet = workbook.Sheets[name];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet, { defval: '' });
}

exports.importExcel = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const wb = XLSX.read(req.file.buffer, { type: 'buffer' });

  // Expected sheets: Classes, Students, Staff, Subjects, Timetable
  const classes = sheetToJson(wb, 'Classes');
  const students = sheetToJson(wb, 'Students');
  const staff = sheetToJson(wb, 'Staff');
  const subjects = sheetToJson(wb, 'Subjects');
  const timetable = sheetToJson(wb, 'Timetable');

  // Upsert classes
  const classNameToId = {};
  for (const c of classes) {
    const doc = await ClassModel.findOneAndUpdate(
      { name: c.Name },
      { $setOnInsert: { name: c.Name } },
      { new: true, upsert: true }
    );
    classNameToId[c.Name] = doc._id;
  }

  // Upsert staff
  const staffEmailToId = {};
  for (const s of staff) {
    const role = s.Role?.toLowerCase() === 'counsellor' ? 'counsellor' : 'staff';
    let doc = await User.findOne({ email: s.Email });
    if (!doc) {
      doc = await User.create({ name: s.Name, email: s.Email, password: s.Password || 'Password1!', role });
    }
    staffEmailToId[s.Email] = doc._id;
    if (role === 'counsellor' && s.Class) {
      await ClassModel.updateOne({ _id: classNameToId[s.Class] }, { $set: { counsellorId: doc._id } });
    }
  }

  // Upsert students
  const studentEmailToId = {};
  for (const st of students) {
    const classId = classNameToId[st.Class];
    let doc = await User.findOne({ email: st.Email });
    if (!doc) {
      doc = await User.create({ name: st.Name, email: st.Email, password: st.Password || 'Password1!', role: 'student', classId });
    } else if (!doc.classId && classId) {
      doc.classId = classId; await doc.save();
    }
    studentEmailToId[st.Email] = doc._id;
    await ClassModel.updateOne({ _id: classId }, { $addToSet: { students: doc._id } });
  }

  // Upsert subjects
  const subjectCodeToId = {};
  for (const sub of subjects) {
    const classId = classNameToId[sub.Class];
    const staffId = staffEmailToId[sub.StaffEmail];
    const doc = await Subject.findOneAndUpdate(
      { code: sub.Code },
      { $set: { name: sub.Name, code: sub.Code, classId, staffId } },
      { new: true, upsert: true }
    );
    subjectCodeToId[sub.Code] = doc._id;
    if (staffId) await User.updateOne({ _id: staffId }, { $addToSet: { assignedSubjects: doc._id } });
  }

  // Timetable rows: Day, Class, PeriodNo, SubjectCode, StaffEmail
  const bulkTT = [];
  const grouped = {};
  for (const row of timetable) {
    const key = `${row.Class}|${row.Day}`;
    grouped[key] = grouped[key] || [];
    grouped[key].push({ periodNo: Number(row.PeriodNo), subjectId: subjectCodeToId[row.SubjectCode], staffId: staffEmailToId[row.StaffEmail] });
  }
  for (const key of Object.keys(grouped)) {
    const [className, day] = key.split('|');
    bulkTT.push({ updateOne: { filter: { classId: classNameToId[className], day }, update: { $set: { periods: grouped[key] } }, upsert: true } });
  }
  if (bulkTT.length) await Timetable.bulkWrite(bulkTT);

  res.json({ message: 'Import completed' });
};

exports.importSheet = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const { name } = req.params; // Classes | Students | Staff | Subjects | Timetable
  const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });

  switch (name) {
    case 'Classes':
      {
        const ClassModel = require('../models/Class.model');
        const Department = require('../models/Department.model');
        for (const c of rows) {
          const dept = await Department.findOneAndUpdate(
            { code: String(c.DepartmentCode).toUpperCase() },
            { $setOnInsert: { code: String(c.DepartmentCode).toUpperCase(), name: String(c.DepartmentCode) } },
            { new: true, upsert: true }
          );
          await ClassModel.findOneAndUpdate(
            { name: c.Name },
            { $set: { departmentId: dept._id, year: Number(c.Year), semester: Number(c.Semester || c.Sem), section: c.Section || 'A' } },
            { new: true, upsert: true }
          );
        }
      }
      break;
    case 'Students':
      {
        const ClassModel = require('../models/Class.model');
        const User = require('../models/User.model');
        for (const s of rows) {
          const klass = await ClassModel.findOne({ name: s.Class });
          let doc = await User.findOne({ email: s.Email });
          if (!doc) doc = await User.create({ name: s.Name, email: s.Email, password: s.Password || 'Password1!', role: 'student', classId: klass?._id });
          if (klass) await ClassModel.updateOne({ _id: klass._id }, { $addToSet: { students: doc._id } });
        }
      }
      break;
    case 'Staff':
      {
        const Department = require('../models/Department.model');
        const User = require('../models/User.model');
        for (const st of rows) {
          const dept = await Department.findOneAndUpdate(
            { code: String(st.DepartmentCode).toUpperCase() },
            { $setOnInsert: { code: String(st.DepartmentCode).toUpperCase(), name: String(st.DepartmentCode) } },
            { new: true, upsert: true }
          );
          const role = String(st.Role || 'staff').toLowerCase();
          let user = await User.findOne({ email: st.Email });
          if (!user) user = await User.create({ name: st.Name, email: st.Email, password: st.Password || 'Password1!', role, staffId: st.StaffId, departmentId: dept._id });
          else await User.updateOne({ _id: user._id }, { departmentId: dept._id, staffId: st.StaffId, role });
        }
      }
      break;
    case 'Subjects':
      {
        const Department = require('../models/Department.model');
        const Subject = require('../models/Subject.model');
        for (const sub of rows) {
          const dept = await Department.findOneAndUpdate(
            { code: String(sub.DepartmentCode).toUpperCase() },
            { $setOnInsert: { code: String(sub.DepartmentCode).toUpperCase(), name: String(sub.DepartmentCode) } },
            { new: true, upsert: true }
          );
          await Subject.findOneAndUpdate(
            { code: sub.Code },
            { $set: { code: sub.Code, name: sub.Name, departmentId: dept._id } },
            { new: true, upsert: true }
          );
        }
      }
      break;
    case 'Timetable':
      {
        const ClassModel = require('../models/Class.model');
        const Subject = require('../models/Subject.model');
        const User = require('../models/User.model');
        const Timetable = require('../models/Timetable.model');
        const map = {};
        for (const row of rows) {
          const klass = await ClassModel.findOne({ name: row.Class });
          const subject = await Subject.findOne({ code: row.SubjectCode });
          const staff = await User.findOne({ email: row.StaffEmail });
          if (!klass || !subject || !staff) continue;
          const key = `${klass._id}|${row.Day}`;
          map[key] = map[key] || { classId: klass._id, day: row.Day, periods: [] };
          map[key].periods.push({ periodNo: Number(row.PeriodNo), subjectId: subject._id, staffId: staff._id, classId: klass._id });
        }
        for (const k of Object.keys(map)) {
          const { classId, day, periods } = map[k];
          await Timetable.findOneAndUpdate({ classId, day }, { $set: { periods } }, { upsert: true });
        }
      }
      break;
    case 'SubjectOfferings':
      {
        const ClassModel = require('../models/Class.model');
        const Subject = require('../models/Subject.model');
        const User = require('../models/User.model');
        const SubjectOffering = require('../models/SubjectOffering.model');
        for (const row of rows) {
          const klass = await ClassModel.findOne({ name: row.Class });
          const subject = await Subject.findOne({ code: row.SubjectCode });
          const staff = await User.findOne({ email: row.StaffEmail });
          if (!klass || !subject || !staff) continue;
          await SubjectOffering.findOneAndUpdate({ subjectId: subject._id, classId: klass._id, staffId: staff._id }, {}, { upsert: true });
        }
      }
      break;
    default:
      return res.status(400).json({ message: 'Unknown sheet' });
  }

  res.json({ message: `${name} imported` });
};


