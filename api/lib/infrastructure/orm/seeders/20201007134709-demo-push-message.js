'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'PushMessages',
      [
        {
          id: 1,
          name: 'NEXT_BREAK',
          title: '🚨 Policia da ergonomia',
          body: 'Você está sendo conduzido a tirar um break. 💔',
          category: 'UN_BREAK_START_CATEGORY',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'START_CYCLE',
          title: '🥰 Bom dia flor do dia',
          body: 'Vamos começar o seu ciclo de trabalho de hoje? ❤️',
          category: 'UN_START_CATEGORY',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'NEXT_WORK',
          title: '💼 Seu advogado conseguiu!',
          body: 'Habeas corpus liberado, pode voltar a trabalhar. 🤎',
          category: 'UN_BREAK_END_CATEGORY',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: 'WORK_IDLE',
          title: '⚠️⚠️⚠️',
          body: 'Você esqueceu de tirar um descanso!!! 🧡',
          category: 'UN_BREAK_START_CATEGORY',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: 'BREAK_IDLE',
          title: '⚠️⚠️⚠️',
          body: 'Você esqueceu de voltar a trabalhar!!! 💜',
          category: 'UN_BREAK_END_CATEGORY',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: 'PAUSE_IDLE',
          title: '⚠️⚠️⚠️',
          body: 'Você esqueceu o timer pausado!!! 💚',
          category: 'UN_DEFAULT_CATEGORY',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: 'INACTIVE',
          title: '🚫🚫🚫',
          body: 'Você me esqueceu mesmo né. Até amanhã então...',
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
