'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'PushMessages',
      [
        {
          id: 1,
          name: 'NEXT_BREAK',
          title: 'Time to take a break',
          body: 'Take the time to rest and see you soon',
          category: 'UN_BREAK_START_CATEGORY',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'START_CYCLE',
          title: 'The time has come',
          body: 'Your cycle will start, enjoy!!',
          category: 'UN_START_CATEGORY',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'NEXT_WORK',
          title: 'Hey!',
          body: 'It is time to start working',
          category: 'UN_BREAK_END_CATEGORY',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: 'WORK_IDLE',
          title: 'Come on!',
          body: 'You forgot to take a break',
          category: 'UN_BREAK_START_CATEGORY',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: 'BREAK_IDLE',
          title: 'Hey, attention!',
          body: 'You forgot to go back to work',
          category: 'UN_BREAK_END_CATEGORY',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: 'PAUSE_IDLE',
          title: 'Let`s go back?',
          body: 'Your team has been paused for a long time',
          category: 'UN_DEFAULT_CATEGORY',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: 'INACTIVE',
          title: 'Your timer has been reset',
          body: 'See you tomorrow',
          category: 'UN_DEFAULT_CATEGORY',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('PushMessages', null, {})
  },
}
