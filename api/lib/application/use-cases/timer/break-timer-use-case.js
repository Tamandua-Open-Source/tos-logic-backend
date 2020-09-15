class BreakTimerUseCase {
  constructor({ userRepository, stateMachineFacade, schedulingFacade }) {
    this.userRepository = userRepository
    this.stateMachineFacade = stateMachineFacade
    this.schedulingFacade = schedulingFacade
  }

  async execute(userId) {
    //DEBUG: RESET TO TRIGGABLE STATE
    // await this.userRepository.patchUserPreferences(userId, {
    //   lastState: 'PAUSE',
    //   currentState: 'WORK',
    // })

    const preferences = await this.userRepository.getUserPreferences(userId)

    if (!preferences) {
      return null
    }

    if (!this.stateMachineFacade.canBreakFrom(preferences.currentState)) {
      return null
    }

    //na QueueFacade: remove push notifications
    //na QueueFacade: remove internal actions

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastBreakStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.stateMachineFacade.onBreak(),
      }
    )

    //na QueueFacade: adiciona next_work
    //na QueueFacade: adiciona move_to_break_idle

    return {
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
    }
  }
}

export default BreakTimerUseCase
