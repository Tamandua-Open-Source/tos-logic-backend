class ResumeTimerUseCase {
  constructor({ stateMachineFacade }) {
    this.stateMachineFacade = stateMachineFacade
  }

  async execute({ userId, idToken }) {
    return await this.stateMachineFacade.onResume({ userId, idToken })
  }
}

export default ResumeTimerUseCase
