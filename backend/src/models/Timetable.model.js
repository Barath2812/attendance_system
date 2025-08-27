const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema(
  {
    periodNo: { type: Number, required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    day: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], required: true },
    periods: { type: [periodSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timetable', timetableSchema);


