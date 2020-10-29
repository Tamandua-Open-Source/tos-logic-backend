class StartTimerUseCase {
  constructor({ stateMachineFacade }) {
    this.stateMachineFacade = stateMachineFacade
  }

  async execute({ userId, idToken }) {
    return await this.stateMachineFacade.onStart({ userId, idToken })
  }
}

export default StartTimerUseCase
