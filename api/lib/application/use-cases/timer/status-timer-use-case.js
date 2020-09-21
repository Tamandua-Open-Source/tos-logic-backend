class StatusTimerUseCase {
  constructor({ stateMachineFacade }) {
    this.stateMachineFacade = stateMachineFacade
  }

  async execute(userId) {
    return await this.stateMachineFacade.onStatus({ userId })
  }
}

export default StatusTimerUseCase
