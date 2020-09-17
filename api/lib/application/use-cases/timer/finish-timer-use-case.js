class FinishTimerUseCase {
  constructor({ userRepository, stateMachineFacade, schedulingFacade }) {
    this.userRepository = userRepository
    this.stateMachineFacade = stateMachineFacade
    this.schedulingFacade = schedulingFacade
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

    this.schedulingFacade.removeAllScheduledPushNotifications(userId)
    this.schedulingFacade.removeAllScheduledIdleSystemActions(userId)

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastState: preferences.currentState,
        currentState: this.stateMachineFacade.onFinish(),
      }
    )

    this.schedulingFacade.scheduleStartCycleNotification(
      userId,
      preferences.fcmToken
    )

    return {
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
    }
  }
}

export default FinishTimerUseCase
