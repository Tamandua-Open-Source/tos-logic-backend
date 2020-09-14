class FinishTimerUseCase {
  constructor({ userRepository, stateMachineFacade }) {
    this.userRepository = userRepository
    this.stateMachineFacade = stateMachineFacade
  }

  async execute(userId) {
    //DEBUG: RESET TO TRIGGABLE STATE
    // await this.userRepository.patchUserPreferences(userId, {
    //   lastState: 'BREAK',
    //   currentState: 'WORK',
    // })

    const preferences = await this.userRepository.getUserPreferences(userId)

    if (!preferences) {
      return null
    }

    if (!this.stateMachineFacade.canFinishFrom(preferences.currentState)) {
      return null
    }

    //na QueueFacade: remove push notifications
    //na QueueFacade: remove internal actions

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastState: preferences.currentState,
        currentState: this.stateMachineFacade.onFinish(),
      }
    )

    //na QueueFacade: adiciona start_cycle

    return {
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
    }
  }
}

export default FinishTimerUseCase
