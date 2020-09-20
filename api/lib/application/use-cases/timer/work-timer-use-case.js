class WorkTimerUseCase {
  constructor({ stateMachineFacade }) {
    this.stateMachineFacade = stateMachineFacade
  }

  async execute(userId) {
    return await this.stateMachineFacade.onWork({ userId })
  }
}

export default WorkTimerUseCase
