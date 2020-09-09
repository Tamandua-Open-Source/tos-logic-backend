class WorkTimerUseCase {
  constructor() {}

  async execute(userId) {
    return {
      from: 'BREAK',
      to: 'WORK',
    }
  }
}

export default WorkTimerUseCase
