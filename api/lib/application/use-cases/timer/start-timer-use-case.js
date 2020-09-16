class StartTimerUseCase {
  constructor({ userRepository, stateMachineFacade, schedulingFacade }) {
    this.userRepository = userRepository
    this.stateMachineFacade = stateMachineFacade
    this.schedulingFacade = schedulingFacade
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

    this.schedulingFacade.removeAllScheduledPushNotifications(userId)
    //na QueueFacade: remove internal actions

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastWorkStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.stateMachineFacade.onStart(),
      }
    )

    this.schedulingFacade.scheduleNextBreakNotification(
      userId,
      preferences.fcmToken
    )
    //na QueueFacade: adiciona move_to_work_idle

    return {
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
    }
  }
}

export default StartTimerUseCase
