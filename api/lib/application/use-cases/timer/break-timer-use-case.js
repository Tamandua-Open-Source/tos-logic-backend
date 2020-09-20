class BreakTimerUseCase {
  constructor({ stateMachineFacade }) {
    this.stateMachineFacade = stateMachineFacade
  }

  async execute(userId) {
    return await this.stateMachineFacade.onBreak({ userId })
  }
}

export default BreakTimerUseCase
