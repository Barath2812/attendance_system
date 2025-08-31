const { SubjectOffering, Class, Subject } = require('../models/index');

exports.getMyClasses = async (req, res) => {
  try {
    const offerings = await SubjectOffering.findAll({ 
      where: { staffId: req.user.id },
      attributes: ['classId'],
      include: [{ model: Class, as: 'class' }]
    });
    const classes = offerings.map(o => o.class);
    res.json(classes);
  } catch (error) {
    console.error('Error getting staff classes:', error);
    res.status(500).json({ message: 'Failed to fetch classes', error: error.message });
  }
};

exports.getClassSubjectsForStaff = async (req, res) => {
  try {
    const { id } = req.params; // classId
    const offerings = await SubjectOffering.findAll({ 
      where: { staffId: req.user.id, classId: id },
      include: [{ model: Subject, as: 'subject' }]
    });
    const subjects = offerings.map(o => o.subject);
    res.json(subjects);
  } catch (error) {
    console.error('Error getting class subjects for staff:', error);
    res.status(500).json({ message: 'Failed to fetch subjects', error: error.message });
  }
};


