const { Class, User } = require('../models/index');

exports.listClasses = async (_req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        { model: User, as: 'counsellor', attributes: ['id', 'name'] },
        { model: User, as: 'students', attributes: ['id', 'name'] }
      ]
    });
    res.json(classes);
  } catch (error) {
    console.error('Error listing classes:', error);
    res.status(500).json({ message: 'Failed to fetch classes', error: error.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const klass = await Class.findByPk(id, {
      include: [
        { model: User, as: 'counsellor', attributes: ['id', 'name'] },
        { model: User, as: 'students', attributes: ['id', 'name'] }
      ]
    });
    if (!klass) return res.status(404).json({ message: 'Class not found' });
    res.json(klass);
  } catch (error) {
    console.error('Error getting class by id:', error);
    res.status(500).json({ message: 'Failed to fetch class', error: error.message });
  }
};

exports.getClassStudents = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`\n🔍 DEBUG: Getting students for class ID: ${id}`);
    
    const klass = await Class.findByPk(id, {
      include: [
        { model: User, as: 'students', attributes: ['id', 'name', 'email'] }
      ]
    });
    
    if (!klass) return res.status(404).json({ message: 'Class not found' });
    
    console.log(`Class found: ${klass.name}`);
    console.log(`Students through association: ${klass.students ? klass.students.length : 0}`);
    
    // Fallback: if no students through association, try direct query
    if (!klass.students || klass.students.length === 0) {
      const directStudents = await User.findAll({
        where: { classId: id, role: 'student' },
        attributes: ['id', 'name', 'email']
      });
      console.log(`Fallback query found ${directStudents.length} students for class ${id}`);
      
      // Also check all students in the system
      const allStudents = await User.findAll({
        where: { role: 'student' },
        attributes: ['id', 'name', 'email', 'classId']
      });
      console.log(`Total students in system: ${allStudents.length}`);
      console.log('All students:', allStudents.map(s => ({ name: s.name, email: s.email, classId: s.classId })));
      
      return res.json(directStudents);
    }
    
    console.log(`Association query found ${klass.students.length} students for class ${id}`);
    res.json(klass.students.map((s) => ({ id: s.id, name: s.name, email: s.email })));
  } catch (error) {
    console.error('Error getting class students:', error);
    res.status(500).json({ message: 'Failed to fetch students', error: error.message });
  }
};


