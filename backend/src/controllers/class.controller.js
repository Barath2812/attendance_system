const ClassModel = require('../models/Class.model');
const User = require('../models/User.model');

exports.listClasses = async (_req, res) => {
  const classes = await ClassModel.find({}).lean();
  res.json(classes);
};

exports.getClassStudents = async (req, res) => {
  const { id } = req.params;
  const klass = await ClassModel.findById(id).lean();
  if (!klass) return res.status(404).json({ message: 'Class not found' });
  const students = await User.find({ _id: { $in: klass.students } }, { name: 1 }).lean();
  res.json(students.map((s) => ({ _id: s._id, name: s.name })));
};


