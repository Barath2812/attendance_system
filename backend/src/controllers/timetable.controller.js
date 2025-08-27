const { validationResult } = require('express-validator');
const Timetable = require('../models/Timetable.model');

exports.addTimetable = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { classId, day, periods } = req.body;
  const tt = await Timetable.findOneAndUpdate(
    { classId, day },
    { $set: { periods } },
    { new: true, upsert: true }
  );
  res.json(tt);
};

exports.getClassTimetable = async (req, res) => {
  const { classId } = req.params;
  const list = await Timetable.find({ classId });
  res.json(list);
};


