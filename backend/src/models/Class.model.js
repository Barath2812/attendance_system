const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., IT-2-4-A
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    year: { type: Number, required: true },
    semester: { type: Number, required: true },
    section: { type: String, default: 'A' },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    counsellorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);


