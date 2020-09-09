class FinishTimerUseCase {
  constructor() {}

  async execute(userId) {
    return {
      from: 'WORKING',
      to: 'INATIVE',
    }
  }
}

export default FinishTimerUseCase
