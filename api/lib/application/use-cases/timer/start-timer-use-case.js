class StartTimerUseCase {
  constructor() {}

  async execute(userId) {
    return {
      from: 'INATIVE',
      to: 'WORK',
    }
  }
}

export default StartTimerUseCase
