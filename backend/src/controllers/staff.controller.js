const { SubjectOffering, Class, Subject, User, Department } = require('../models/index');

exports.getMyClasses = async (req, res) => {
  try {
    console.log('🔍 Fetching classes for staff ID:', req.user.id);
    
    // First try to get classes through SubjectOfferings
    const offerings = await SubjectOffering.findAll({ 
      where: { staffId: req.user.id },
      include: [
        { 
          model: Class, 
          as: 'class',
          include: [{ model: Department, as: 'department' }]
        }
      ]
    });

    console.log('📚 Found SubjectOfferings:', offerings.length);

    // If no SubjectOfferings, try to get classes through Timetable
    let classes = [];
    if (offerings.length > 0) {
      classes = offerings.map(o => o.class);
    } else {
      console.log('📅 No SubjectOfferings found, checking Timetable...');
      // This would require adding Timetable to the models import
      // For now, we'll return empty array and suggest creating SubjectOfferings
    }

    // Remove duplicates (in case staff teaches multiple subjects in same class)
    const uniqueClasses = classes.filter((cls, index, self) => 
      index === self.findIndex(c => c.id === cls.id)
    );

    console.log('✅ Returning classes:', uniqueClasses.length);
    res.json(uniqueClasses);
  } catch (error) {
    console.error('❌ Error getting staff classes:', error);
    res.status(500).json({ 
      message: 'Failed to fetch classes', 
      error: error.message,
      details: 'Make sure SubjectOffering records exist linking staff to classes'
    });
  }
};

exports.getClassSubjectsForStaff = async (req, res) => {
  try {
    const { id } = req.params; // classId
    console.log('🔍 Fetching subjects for class:', id, 'and staff:', req.user.id);
    
    const offerings = await SubjectOffering.findAll({ 
      where: { staffId: req.user.id, classId: id },
      include: [{ model: Subject, as: 'subject' }]
    });
    
    const subjects = offerings.map(o => o.subject);
    console.log('✅ Found subjects:', subjects.length);
    res.json(subjects);
  } catch (error) {
    console.error('❌ Error getting class subjects for staff:', error);
    res.status(500).json({ 
      message: 'Failed to fetch subjects', 
      error: error.message 
    });
  }
};

// New function to get staff's complete schedule
exports.getMySchedule = async (req, res) => {
  try {
    const { staffId } = req.user;
    console.log('🔍 Fetching schedule for staff ID:', staffId);
    
    // Get all classes where staff teaches
    const offerings = await SubjectOffering.findAll({
      where: { staffId },
      include: [
        { model: Class, as: 'class' },
        { model: Subject, as: 'subject' }
      ]
    });

    // Group by class
    const scheduleByClass = {};
    offerings.forEach(offering => {
      const classKey = offering.class.id;
      if (!scheduleByClass[classKey]) {
        scheduleByClass[classKey] = {
          class: offering.class,
          subjects: []
        };
      }
      scheduleByClass[classKey].subjects.push(offering.subject);
    });

    const schedule = Object.values(scheduleByClass);
    console.log('✅ Returning schedule with', schedule.length, 'classes');
    res.json(schedule);
  } catch (error) {
    console.error('❌ Error getting staff schedule:', error);
    res.status(500).json({ 
      message: 'Failed to fetch schedule', 
      error: error.message 
    });
  }
};


