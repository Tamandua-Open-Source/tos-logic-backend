class StartTimerUseCase {
  constructor({ userRepository, stateMachineFacade }) {
    this.userRepository = userRepository
    this.stateMachineFacade = stateMachineFacade
  }

  async execute(userId) {
    //DEBUG: RESET TO TRIGGABLE STATE
    // await this.userRepository.patchUserPreferences(userId, {
    //   lastState: 'WORK',
    //   currentState: 'INATIVE',
    // })

    const preferences = await this.userRepository.getUserPreferences(userId)

    if (!preferences) {
      return null
    }

    if (!this.stateMachineFacade.canStartFrom(preferences.currentState)) {
      return null
    }

    //na QueueFacade: remove push notifications
    //na QueueFacade: remove internal actions

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastWorkStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.stateMachineFacade.onStart(),
      }
    )

    //na QueueFacade: adiciona next_break
    //na QueueFacade: adiciona move_to_work_idle

    return {
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
    }
  }
}

export default StartTimerUseCase
