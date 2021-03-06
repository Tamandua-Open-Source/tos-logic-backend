'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TimerPreferences', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      UserId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      fcmToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      allowTimerNotifications: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      breakDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      breakLimitDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      breakIdleLimitDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lastBreakStartTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      workDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      workLimitDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      workIdleLimitDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lastWorkStartTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      pauseLimitDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pauseIdleLimitDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lastPauseStartTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      currentState: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastState: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TimerPreferences')
  },
}
