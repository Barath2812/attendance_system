const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SubjectOffering = sequelize.define('SubjectOffering', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'subjects',
      key: 'id'
    }
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'classes',
      key: 'id'
    }
  },
  staffId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  tableName: 'subject_offerings',
  indexes: [
    {
      unique: true,
      fields: ['subjectId', 'classId', 'staffId']
    }
  ]
});

module.exports = SubjectOffering;


