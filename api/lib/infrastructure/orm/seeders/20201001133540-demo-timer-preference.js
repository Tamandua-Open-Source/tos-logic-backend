'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'TimerPreferences',
      [
        {
          id: -1,
          UserId: 'vN7Kodp84zQg1KDTPd3IfwvaF1r1',
          startTime: new Date(),
          breakDuration: 5000,
          breakLimitDuration: 15000,
          breakIdleLimitDuration: 10000,
          lastBreakStartTime: new Date(),
          workDuration: 5000,
          workLimitDuration: 15000,
          workIdleLimitDuration: 10000,
          lastWorkStartTime: new Date(),
          pauseLimitDuration: 15000,
          pauseIdleLimitDuration: 10000,
          lastPauseStartTime: new Date(),
          currentState: 'INACTIVE',
          lastState: 'INACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TimerPreferences', null, {})
  },
}
