class FinishTimerUseCase {
  constructor({ stateMachineFacade }) {
    this.stateMachineFacade = stateMachineFacade
  }

  async execute(userId) {
    return await this.stateMachineFacade.onFinish({ userId })
  }
}

export default FinishTimerUseCase
