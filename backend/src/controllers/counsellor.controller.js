const { Class, User, SubjectOffering, Subject, Attendance } = require('../models/index');

exports.getClassOverview = async (req, res) => {
  try {
    const { id } = req.params; // classId
    const klass = await Class.findByPk(id, {
      include: [
        { model: User, as: 'students', attributes: ['id', 'name', 'email'] }
      ]
    });
    if (!klass) return res.status(404).json({ message: 'Class not found' });
    if (klass.counsellorId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    
    const offerings = await SubjectOffering.findAll({ 
      where: { classId: id },
      include: [{ model: Subject, as: 'subject' }]
    });
    const subjects = offerings.map(o => o.subject);

    const byStudent = {};
    const attendance = await Attendance.findAll({ 
      where: { classId: id },
      attributes: ['studentId', 'status']
    });
    
    attendance.forEach((a) => {
      const key = String(a.studentId);
      byStudent[key] = byStudent[key] || { present: 0, total: 0 };
      byStudent[key].total += 1;
      if (a.status === 'Present') byStudent[key].present += 1;
    });

    res.json({ 
      class: klass, 
      students: klass.students, 
      subjects, 
      statsByStudent: byStudent 
    });
  } catch (error) {
    console.error('Error getting class overview:', error);
    res.status(500).json({ message: 'Failed to fetch class overview', error: error.message });
  }
};


