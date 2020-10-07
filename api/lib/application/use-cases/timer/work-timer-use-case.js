class WorkTimerUseCase {
  constructor({ stateMachineFacade }) {
    this.stateMachineFacade = stateMachineFacade
  }

  async execute({ userId, idToken }) {
    return await this.stateMachineFacade.onWork({ userId, idToken })
  }
}

export default WorkTimerUseCase
