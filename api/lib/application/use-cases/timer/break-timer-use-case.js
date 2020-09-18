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

    this.schedulingFacade.removeAllScheduledPushNotifications({ userId })
    this.schedulingFacade.removeAllScheduledIdleSystemActions({ userId })

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastBreakStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.stateMachineFacade.onBreak(),
      }
    )

    this.schedulingFacade.scheduleNextWorkNotification({
      userId,
      fcmToken: preferences.fcmToken,
      delay: preferences.breakDuration,
    })

    this.schedulingFacade.scheduleBreakIdleAction({
      userId,
      fcmToken: preferences.fcmToken,
      delay: preferences.breakLimitDuration,
      delayToInactive:
        preferences.breakLimitDuration + preferences.breakIdleLimitDuration,
      delayStartCycle: 35000, //calcular
    })

    return {
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
    }
  }
}

export default BreakTimerUseCase
