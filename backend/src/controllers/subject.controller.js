const Subject = require('../models/Subject.model');

exports.listMySubjects = async (req, res) => {
  if (req.user.role === 'staff') {
    const subjects = await Subject.find({ staffId: req.user._id }).lean();
    return res.json(subjects);
  }
  if (req.user.role === 'counsellor') {
    const subjects = await Subject.find({}).lean();
    return res.json(subjects);
  }
  return res.status(403).json({ message: 'Forbidden' });
};

exports.listByClass = async (req, res) => {
  const { classId } = req.params;
  const subjects = await Subject.find({ classId }).lean();
  return res.json(subjects);
};


