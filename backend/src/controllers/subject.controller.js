const { Subject, SubjectOffering, Department } = require('../models/index');

exports.listMySubjects = async (req, res) => {
  try {
    if (req.user.role === 'staff') {
      const offerings = await SubjectOffering.findAll({ 
        where: { staffId: req.user.id },
        include: [{ model: Subject, as: 'subject' }]
      });
      const subjects = offerings.map(o => o.subject);
      return res.json(subjects);
    }
    if (req.user.role === 'counsellor') {
      const subjects = await Subject.findAll();
      return res.json(subjects);
    }
    return res.status(403).json({ message: 'Forbidden' });
  } catch (error) {
    console.error('Error listing subjects:', error);
    res.status(500).json({ message: 'Failed to fetch subjects', error: error.message });
  }
};

exports.listByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const offerings = await SubjectOffering.findAll({ 
      where: { classId },
      include: [{ model: Subject, as: 'subject' }]
    });
    const subjects = offerings.map(o => o.subject);
    return res.json(subjects);
  } catch (error) {
    console.error('Error listing subjects by class:', error);
    res.status(500).json({ message: 'Failed to fetch subjects', error: error.message });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByPk(id, {
      include: [{ model: Department, as: 'department', attributes: ['id', 'name'] }]
    });
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    res.json(subject);
  } catch (error) {
    console.error('Error getting subject by id:', error);
    res.status(500).json({ message: 'Failed to fetch subject', error: error.message });
  }
};


