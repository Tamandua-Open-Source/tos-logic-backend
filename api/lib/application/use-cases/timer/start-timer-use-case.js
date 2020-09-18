class StartTimerUseCase {
  constructor({ userRepository, stateMachineFacade, schedulingFacade }) {
    this.userRepository = userRepository
    this.stateMachineFacade = stateMachineFacade
    this.schedulingFacade = schedulingFacade
  }

  async execute(userId) {
    // DEBUG: RESET TO TRIGGABLE STATE
    // await this.userRepository.patchUserPreferences(userId, {
    //   lastState: 'WORK',
    //   currentState: 'INACTIVE',
    // })

    const preferences = await this.userRepository.getUserPreferences(userId)

    if (!preferences) {
      return null
    }

    if (!this.stateMachineFacade.canStartFrom(preferences.currentState)) {
      return null
    }

    this.schedulingFacade.removeAllScheduledPushNotifications({ userId })
    this.schedulingFacade.removeAllScheduledIdleSystemActions({ userId })

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastWorkStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.stateMachineFacade.onStart(),
      }
    )

    this.schedulingFacade.scheduleNextBreakNotification({
      userId,
      fcmToken: preferences.fcmToken,
      delay: preferences.workDuration,
    })

    this.schedulingFacade.scheduleWorkIdleAction({
      userId,
      fcmToken: preferences.fcmToken,
      delay: preferences.workLimitDuration,
      delayToInactive:
        preferences.workLimitDuration + preferences.workIdleLimitDuration,
      delayStartCycle: 35000, //calcular
    })

    return {
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
    }
  }
}

export default StartTimerUseCase
