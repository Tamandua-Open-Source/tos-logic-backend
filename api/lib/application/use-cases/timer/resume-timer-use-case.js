class ResumeTimerUseCase {
  constructor() {}

  async execute(userId) {
    return {
      from: 'PAUSE',
      to: 'WORKING',
    }
  }
}

export default ResumeTimerUseCase
