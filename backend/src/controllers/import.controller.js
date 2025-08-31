const XLSX = require('xlsx');
const { User, Class, Subject, Timetable, Department, SubjectOffering } = require('../models/index');
const { Op } = require('sequelize'); // Added Op for sequelize

// Helper function to get password (let User model handle hashing)
function getPassword(password) {
  return password || 'Password1!'; // Default password if none provided
}

function sheetToJson(workbook, name) {
  const sheet = workbook.Sheets[name];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet, { defval: '' });
}

exports.importExcel = async (req, res) => {
  try {
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
    console.log('\n🏫 PROCESSING CLASSES:');
    console.log('Total classes in Excel:', classes.length);
    
    for (const c of classes) {
      console.log(`\n--- Processing Class: ${c.Name} ---`);
      console.log(`Department Code: ${c.DepartmentCode}`);
      console.log(`Year: ${c.Year}`);
      console.log(`Semester: ${c.Semester || c.Sem}`);
      console.log(`Section: ${c.Section || 'A'}`);
      
      // First create/update department
      const [dept] = await Department.findOrCreate({
        where: { code: String(c.DepartmentCode).toUpperCase() },
        defaults: { 
          code: String(c.DepartmentCode).toUpperCase(), 
          name: String(c.DepartmentCode) 
        }
      });
      console.log(`Department: ${dept.code} (ID: ${dept.id})`);
      
      // Then create/update class
      const [doc] = await Class.findOrCreate({
        where: { name: c.Name },
        defaults: { 
          name: c.Name,
          departmentId: dept.id, 
          year: Number(c.Year), 
          semester: Number(c.Semester || c.Sem), 
          section: c.Section || 'A' 
        }
      });
      
      classNameToId[c.Name] = doc.id;
      console.log(`✅ Class ${c.Name} processed (ID: ${doc.id})`);
    }
    
    console.log(`\n📚 CLASSES SUMMARY:`);
    console.log('Classes processed:', Object.keys(classNameToId));
    console.log('Class ID mapping:', classNameToId);

    // Upsert staff
    const staffEmailToId = {};
    for (const s of staff) {
      const role = s.Role?.toLowerCase() === 'counsellor' ? 'counsellor' : 'staff';
      let doc = await User.findOne({ where: { email: s.Email } });
      if (!doc) {
        doc = await User.create({ 
          name: s.Name, 
          email: s.Email, 
          password: getPassword(s.Password), 
          role,
          staffId: s.StaffId || null
        });
      }
      staffEmailToId[s.Email] = doc.id;
      if (role === 'counsellor' && s.Class) {
        await Class.update({ counsellorId: doc.id }, { where: { id: classNameToId[s.Class] } });
      }
    }

    // Upsert students
    const studentEmailToId = {};
    console.log('Processing students:', students.length);
    console.log('Available classes:', Object.keys(classNameToId));
    
    let processedCount = 0;
    let skippedCount = 0;
    
    for (const st of students) {
      console.log(`\n--- Processing Student: ${st.Name} ---`);
      console.log(`Email: ${st.Email}`);
      console.log(`Class: ${st.Class}`);
      console.log(`Password: ${st.Password ? 'Provided' : 'Default'}`);
      
      const classId = classNameToId[st.Class];
      console.log(`Class ID found: ${classId}`);
      
      if (!classId) {
        console.log(`❌ ERROR: Class not found for student ${st.Name}. Available classes: ${Object.keys(classNameToId).join(', ')}`);
        skippedCount++;
        continue;
      }
      
      let doc = await User.findOne({ where: { email: st.Email } });
      if (!doc) {
        doc = await User.create({ 
          name: st.Name, 
          email: st.Email, 
          password: getPassword(st.Password), 
          role: 'student', 
          classId 
        });
        console.log(`✅ CREATED: Student ${st.Name} in class ${st.Class} (ID: ${doc.id})`);
        processedCount++;
      } else {
        console.log(`Found existing student: ${doc.name} (ID: ${doc.id})`);
        if (!doc.classId && classId) {
          await doc.update({ classId });
          console.log(`✅ UPDATED: Student ${st.Name} assigned to class ${st.Class}`);
        } else if (doc.classId !== classId) {
          await doc.update({ classId });
          console.log(`✅ UPDATED: Student ${st.Name} moved from class ${doc.classId} to ${classId}`);
        } else {
          console.log(`ℹ️  Student ${st.Name} already in correct class ${st.Class}`);
        }
        processedCount++;
      }
      studentEmailToId[st.Email] = doc.id;
    }
    
    console.log(`\n📊 STUDENT IMPORT SUMMARY:`);
    console.log(`Total students in Excel: ${students.length}`);
    console.log(`Successfully processed: ${processedCount}`);
    console.log(`Skipped (class not found): ${skippedCount}`);
    console.log(`Student email to ID mapping:`, studentEmailToId);

    // Upsert subjects
    const subjectCodeToId = {};
    for (const sub of subjects) {
      const [doc] = await Subject.findOrCreate({
        where: { code: sub.Code },
        defaults: { name: sub.Name, code: sub.Code }
      });
      subjectCodeToId[sub.Code] = doc.id;
    }

    // Create subject offerings
    for (const sub of subjects) {
      const classId = classNameToId[sub.Class];
      const staffId = staffEmailToId[sub.StaffEmail];
      if (classId && staffId) {
        await SubjectOffering.findOrCreate({
          where: { subjectId: subjectCodeToId[sub.Code], classId, staffId }
        });
      }
    }

    // Timetable rows: Day, Class, PeriodNo, SubjectCode, StaffEmail
    for (const row of timetable) {
      const classId = classNameToId[row.Class];
      const subjectId = subjectCodeToId[row.SubjectCode];
      const staffId = staffEmailToId[row.StaffEmail];
      
      if (classId && subjectId && staffId) {
        await Timetable.findOrCreate({
          where: { classId, day: row.Day, periodNo: Number(row.PeriodNo) },
          defaults: {
            classId,
            day: row.Day,
            periodNo: Number(row.PeriodNo),
            subjectId,
            staffId
          }
        });
      }
    }

    // Verify import by checking database
    console.log('\n🔍 VERIFYING IMPORT...');
    const totalStudentsInDB = await User.count({ where: { role: 'student' } });
    const totalStaffInDB = await User.count({ where: { role: { [Op.in]: ['staff', 'counsellor'] } } });
    const totalClassesInDB = await Class.count();
    const totalSubjectsInDB = await Subject.count();
    
    console.log(`Database verification:`);
    console.log(`- Total students: ${totalStudentsInDB}`);
    console.log(`- Total staff: ${totalStaffInDB}`);
    console.log(`- Total classes: ${totalClassesInDB}`);
    console.log(`- Total subjects: ${totalSubjectsInDB}`);

    console.log('\n🎉 IMPORT COMPLETED SUCCESSFULLY!');
    console.log('=====================================');
    console.log(`Classes processed: ${Object.keys(classNameToId).length}`);
    console.log(`Staff processed: ${Object.keys(staffEmailToId).length}`);
    console.log(`Students processed: ${Object.keys(studentEmailToId).length}`);
    console.log(`Subjects processed: ${Object.keys(subjectCodeToId).length}`);
    console.log(`Subject Offerings created: ${Object.keys(subjectCodeToId).length * Object.keys(classNameToId).length}`);
    console.log(`Timetable entries created: ${timetable.length}`);
    
    res.json({ 
      message: 'Import completed successfully',
      summary: {
        classes: Object.keys(classNameToId).length,
        staff: Object.keys(staffEmailToId).length,
        students: Object.keys(studentEmailToId).length,
        subjects: Object.keys(subjectCodeToId).length,
        subjectOfferings: Object.keys(subjectCodeToId).length * Object.keys(classNameToId).length,
        timetableEntries: timetable.length
      },
      verification: {
        totalStudentsInDB,
        totalStaffInDB,
        totalClassesInDB,
        totalSubjectsInDB
      }
    });
  } catch (error) {
    console.error('❌ IMPORT ERROR:', error);
    res.status(500).json({ message: 'Import failed', error: error.message });
  }
};

exports.importSheet = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { name } = req.params; // Classes | Students | Staff | Subjects | Timetable
    const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });

    switch (name) {
    case 'Classes':
      {
        for (const c of rows) {
          const [dept] = await Department.findOrCreate({
            where: { code: String(c.DepartmentCode).toUpperCase() },
            defaults: { 
              code: String(c.DepartmentCode).toUpperCase(), 
              name: String(c.DepartmentCode) 
            }
          });
          await Class.findOrCreate({
            where: { name: c.Name },
            defaults: { 
              name: c.Name,
              departmentId: dept.id, 
              year: Number(c.Year), 
              semester: Number(c.Semester || c.Sem), 
              section: c.Section || 'A' 
            }
          });
        }
      }
      break;
    case 'Students':
      {
        for (const s of rows) {
          const klass = await Class.findOne({ where: { name: s.Class } });
          if (!klass) {
            console.log(`Class not found for student ${s.Name}: ${s.Class}`);
            continue;
          }
          
          let doc = await User.findOne({ where: { email: s.Email } });
          if (!doc) {
            doc = await User.create({ 
              name: s.Name, 
              email: s.Email, 
              password: getPassword(s.Password), 
              role: 'student', 
              classId: klass.id 
            });
            console.log(`Created student ${s.Name} in class ${klass.name}`);
          } else {
            // Update existing student's class if different
            if (doc.classId !== klass.id) {
              await doc.update({ classId: klass.id });
              console.log(`Updated student ${s.Name} to class ${klass.name}`);
            }
          }
        }
      }
      break;
    case 'Staff':
      {
        for (const st of rows) {
          const [dept] = await Department.findOrCreate({
            where: { code: String(st.DepartmentCode).toUpperCase() },
            defaults: { 
              code: String(st.DepartmentCode).toUpperCase(), 
              name: String(st.DepartmentCode) 
            }
          });
          const role = String(st.Role || 'staff').toLowerCase();
          let user = await User.findOne({ where: { email: st.Email } });
          if (!user) {
            user = await User.create({ 
              name: st.Name, 
              email: st.Email, 
              password: getPassword(st.Password), 
              role, 
              staffId: st.StaffId, 
              departmentId: dept.id 
            });
          } else {
            await user.update({ departmentId: dept.id, staffId: st.StaffId, role });
          }
        }
      }
      break;
    case 'Subjects':
      {
        for (const sub of rows) {
          const [dept] = await Department.findOrCreate({
            where: { code: String(sub.DepartmentCode).toUpperCase() },
            defaults: { 
              code: String(sub.DepartmentCode).toUpperCase(), 
              name: String(sub.DepartmentCode) 
            }
          });
          await Subject.findOrCreate({
            where: { code: sub.Code },
            defaults: { 
              code: sub.Code, 
              name: sub.Name, 
              departmentId: dept.id 
            }
          });
        }
      }
      break;
    case 'Timetable':
      {
        for (const row of rows) {
          const klass = await Class.findOne({ where: { name: row.Class } });
          const subject = await Subject.findOne({ where: { code: row.SubjectCode } });
          const staff = await User.findOne({ where: { email: row.StaffEmail } });
          if (!klass || !subject || !staff) continue;
          
          await Timetable.findOrCreate({
            where: { classId: klass.id, day: row.Day, periodNo: Number(row.PeriodNo) },
            defaults: {
              classId: klass.id,
              day: row.Day,
              periodNo: Number(row.PeriodNo),
              subjectId: subject.id,
              staffId: staff.id
            }
          });
        }
      }
      break;
    case 'SubjectOfferings':
      {
        for (const row of rows) {
          const klass = await Class.findOne({ where: { name: row.Class } });
          const subject = await Subject.findOne({ where: { code: row.SubjectCode } });
          const staff = await User.findOne({ where: { email: row.StaffEmail } });
          if (!klass || !subject || !staff) continue;
          await SubjectOffering.findOrCreate({
            where: { subjectId: subject.id, classId: klass.id, staffId: staff.id }
          });
        }
      }
      break;
      default:
        return res.status(400).json({ message: 'Unknown sheet' });
    }

    res.json({ message: `${name} imported successfully` });
  } catch (error) {
    console.error('Import sheet error:', error);
    res.status(500).json({ message: 'Import failed', error: error.message });
  }
};

// Debug endpoint to check database status
exports.getDatabaseStatus = async (req, res) => {
  try {
    console.log('\n🔍 DATABASE STATUS CHECK');
    
    const totalStudents = await User.count({ where: { role: 'student' } });
    const totalStaff = await User.count({ where: { role: { [Op.in]: ['staff', 'counsellor'] } } });
    const totalClasses = await Class.count();
    const totalSubjects = await Subject.count();
    const totalSubjectOfferings = await SubjectOffering.count();
    
    // Get all students with their class assignments
    const students = await User.findAll({
      where: { role: 'student' },
      attributes: ['id', 'name', 'email', 'classId'],
      include: [{ model: Class, as: 'class', attributes: ['id', 'name'] }]
    });
    
    // Get all classes with student counts
    const classes = await Class.findAll({
      attributes: ['id', 'name'],
      include: [{ model: User, as: 'students', attributes: ['id', 'name', 'email'] }]
    });
    
    console.log(`\n📊 DATABASE SUMMARY:`);
    console.log(`- Total students: ${totalStudents}`);
    console.log(`- Total staff: ${totalStaff}`);
    console.log(`- Total classes: ${totalClasses}`);
    console.log(`- Total subjects: ${totalSubjects}`);
    console.log(`- Total subject offerings: ${totalSubjectOfferings}`);
    
    console.log(`\n👨‍🎓 STUDENTS DETAILS:`);
    students.forEach(s => {
      console.log(`- ${s.name} (${s.email}) -> Class: ${s.class?.name || 'None'} (ID: ${s.classId})`);
    });
    
    console.log(`\n🏫 CLASSES DETAILS:`);
    classes.forEach(c => {
      console.log(`- ${c.name} (ID: ${c.id}) -> Students: ${c.students?.length || 0}`);
    });
    
    res.json({
      summary: { totalStudents, totalStaff, totalClasses, totalSubjects, totalSubjectOfferings },
      students: students.map(s => ({ id: s.id, name: s.name, email: s.email, classId: s.classId, className: s.class?.name })),
      classes: classes.map(c => ({ id: c.id, name: c.name, studentCount: c.students?.length || 0 }))
    });
    
  } catch (error) {
    console.error('Error getting database status:', error);
    res.status(500).json({ message: 'Failed to get database status', error: error.message });
  }
};


