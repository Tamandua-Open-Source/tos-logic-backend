class BreakTimerUseCase {
  constructor({ stateMachineFacade }) {
    this.stateMachineFacade = stateMachineFacade
  }

  async execute({ userId, idToken }) {
    return await this.stateMachineFacade.onBreak({ userId, idToken })
  }
}

export default BreakTimerUseCase
