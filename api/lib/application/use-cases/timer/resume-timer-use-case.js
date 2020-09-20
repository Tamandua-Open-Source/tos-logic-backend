class ResumeTimerUseCase {
  constructor({ stateMachineFacade }) {
    this.stateMachineFacade = stateMachineFacade
  }

  async execute(userId) {
    return await this.stateMachineFacade.onResume({ userId })
  }
}

export default ResumeTimerUseCase
