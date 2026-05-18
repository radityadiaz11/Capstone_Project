const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true
  },
  student_id: {
    type:      DataTypes.INTEGER,
    unique:    true,
    allowNull: false
  },
  age:                  { type: DataTypes.INTEGER },
  gender:               { type: DataTypes.STRING(20) },
  academic_level:       { type: DataTypes.STRING(50) },
  study_hours:          { type: DataTypes.FLOAT },
  self_study_hours:     { type: DataTypes.FLOAT },
  online_classes_hours: { type: DataTypes.FLOAT },
  social_media_hours:   { type: DataTypes.FLOAT },
  gaming_hours:         { type: DataTypes.FLOAT },
  sleep_hours:          { type: DataTypes.FLOAT },
  screen_time_hours:    { type: DataTypes.FLOAT },
  internet_quality:     { type: DataTypes.STRING(20) },
  mental_health_score:  { type: DataTypes.INTEGER },
  focus_index:          { type: DataTypes.FLOAT },
  burnout_level:        { type: DataTypes.FLOAT },
  productivity_score:   { type: DataTypes.FLOAT },
  exam_score:           { type: DataTypes.FLOAT },
  status: {
    type:         DataTypes.STRING(20),
    defaultValue: 'aktif'
  }
}, {
  tableName:   'students',
  timestamps:  true,
  underscored: true
});

module.exports = Student;
