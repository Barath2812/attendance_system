const SubjectOffering = require('../models/SubjectOffering.model');
const ClassModel = require('../models/Class.model');
const Subject = require('../models/Subject.model');

exports.getMyClasses = async (req, res) => {
  const offerings = await SubjectOffering.find({ staffId: req.user._id }).select('classId').lean();
  const classIds = [...new Set(offerings.map((o) => String(o.classId)))];
  const classes = await ClassModel.find({ _id: { $in: classIds } }).lean();
  res.json(classes);
};

exports.getClassSubjectsForStaff = async (req, res) => {
  const { id } = req.params; // classId
  const offerings = await SubjectOffering.find({ staffId: req.user._id, classId: id }).select('subjectId').lean();
  const subjectIds = offerings.map((o) => o.subjectId);
  const subjects = await Subject.find({ _id: { $in: subjectIds } }).lean();
  res.json(subjects);
};


