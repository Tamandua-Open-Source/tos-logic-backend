class BreakTimerUseCase {
  constructor() {}

  async execute(userId) {
    return {
      from: 'WORK',
      to: 'BREAK',
    }
  }
}

export default BreakTimerUseCase
