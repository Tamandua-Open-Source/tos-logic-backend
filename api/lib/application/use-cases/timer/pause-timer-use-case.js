class PauseTimerUseCase {
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

    if (!this.stateMachineFacade.canPauseFrom(preferences.currentState)) {
      return null
    }

    //na QueueFacade: remove push notifications
    //na QueueFacade: remove internal actions

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastPauseStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.stateMachineFacade.onPause(),
      }
    )

    //na QueueFacade: adiciona move_to_pause_idle

    return {
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
    }
  }
}

export default PauseTimerUseCase
