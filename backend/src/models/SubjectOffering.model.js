const mongoose = require('mongoose');

const subjectOfferingSchema = new mongoose.Schema(
  {
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

subjectOfferingSchema.index({ subjectId: 1, classId: 1, staffId: 1 }, { unique: true });

module.exports = mongoose.model('SubjectOffering', subjectOfferingSchema);


