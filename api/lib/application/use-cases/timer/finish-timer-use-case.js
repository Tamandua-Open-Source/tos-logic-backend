class FinishTimerUseCase {
  constructor({ stateMachineFacade }) {
    this.stateMachineFacade = stateMachineFacade
  }

  async execute({ userId, idToken }) {
    return await this.stateMachineFacade.onFinish({ userId, idToken })
  }
}

export default FinishTimerUseCase
