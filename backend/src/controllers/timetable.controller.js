const { validationResult } = require('express-validator');
const { Timetable, Subject, User } = require('../models/index');

exports.addTimetable = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { classId, day, periods } = req.body;
    
    // Delete existing timetable entries for this class and day
    await Timetable.destroy({ where: { classId, day } });
    
    // Create new timetable entries
    const timetableEntries = periods.map(period => ({
      classId,
      day,
      periodNo: period.periodNo,
      subjectId: period.subjectId,
      staffId: period.staffId
    }));
    
    const tt = await Timetable.bulkCreate(timetableEntries);
    res.json(tt);
  } catch (error) {
    console.error('Error adding timetable:', error);
    res.status(500).json({ message: 'Failed to add timetable', error: error.message });
  }
};

exports.getClassTimetable = async (req, res) => {
  try {
    const { classId } = req.params;
    const list = await Timetable.findAll({ 
      where: { classId },
      include: [
        { model: Subject, as: 'subject', attributes: ['id', 'name', 'code'] },
        { model: User, as: 'staff', attributes: ['id', 'name'] }
      ],
      order: [['day', 'ASC'], ['periodNo', 'ASC']]
    });
    res.json(list);
  } catch (error) {
    console.error('Error getting class timetable:', error);
    res.status(500).json({ message: 'Failed to fetch timetable', error: error.message });
  }
};


