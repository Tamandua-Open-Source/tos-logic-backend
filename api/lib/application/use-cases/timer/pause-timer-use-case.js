class PauseTimerUseCase {
  constructor() {}

  async execute(userId) {
    return {
      from: 'WORKING',
      to: 'PAUSE',
    }
  }
}

export default PauseTimerUseCase
