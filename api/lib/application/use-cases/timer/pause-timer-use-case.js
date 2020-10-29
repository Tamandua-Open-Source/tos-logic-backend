class PauseTimerUseCase {
  constructor({ stateMachineFacade }) {
    this.stateMachineFacade = stateMachineFacade
  }

  async execute({ userId, idToken }) {
    return await this.stateMachineFacade.onPause({ userId, idToken })
  }
}

export default PauseTimerUseCase
