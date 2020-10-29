'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class TimerPreference extends Model {
    static associate(models) {}
  }
  TimerPreference.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      UserId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      fcmToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      breakDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      breakLimitDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      breakIdleLimitDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lastBreakStartTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      workDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      workLimitDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      workIdleLimitDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lastWorkStartTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      pauseLimitDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pauseIdleLimitDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lastPauseStartTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      currentState: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastState: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'TimerPreference',
    }
  )
  return TimerPreference
}
