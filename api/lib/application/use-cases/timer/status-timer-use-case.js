class StatusTimerUseCase {
  constructor({ stateMachineFacade }) {
    this.stateMachineFacade = stateMachineFacade
  }

  async execute({ userId, idToken }) {
    return await this.stateMachineFacade.onStatus({ userId, idToken })
  }
}

export default StatusTimerUseCase
