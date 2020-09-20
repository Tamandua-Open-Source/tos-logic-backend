class ResumeTimerUseCase {
  constructor({ userRepository, stateMachineFacade, schedulingFacade }) {
    this.userRepository = userRepository
    this.stateMachineFacade = stateMachineFacade
    this.schedulingFacade = schedulingFacade
  }

  async execute(userId) {
    //DEBUG: RESET TO TRIGGABLE STATE
    // await this.userRepository.patchUserPreferences(userId, {
    //   lastState: 'WORK',
    //   currentState: 'PAUSE',
    // })

    const preferences = await this.userRepository.getUserPreferences(userId)

    if (!preferences) {
      return null
    }

    if (!this.stateMachineFacade.canResumeFrom(preferences.currentState)) {
      return null
    }

    this.schedulingFacade.removeAllScheduledPushNotifications({ userId })
    this.schedulingFacade.removeAllScheduledIdleSystemActions({ userId })

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastWorkStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.stateMachineFacade.onResume(preferences.lastState),
      }
    )

    if (preferences.lastState === this.stateMachineFacade.workState) {
      const lastWorkStartTime = new Date(preferences.lastWorkStartTime)
      const lastPauseStartTime = new Date(preferences.lastPauseStartTime)
      const elapsedDuration =
        lastWorkStartTime.getMilliseconds() -
        lastPauseStartTime.getMilliseconds()

      console.log(
        '[DEBUG] - WORK_STATE - elapsed duration: ',
        elapsedDuration,
        'ms',
        lastWorkStartTime
      )

      this.schedulingFacade.scheduleNextBreakNotification({
        userId,
        fcmToken: preferences.fcmToken,
        delay: preferences.workDuration - elapsedDuration,
      })

      this.schedulingFacade.scheduleWorkIdleAction({
        userId,
        fcmToken: preferences.fcmToken,
        delay: 15000 ?? preferences.workLimitDuration - elapsedDuration,
        delayToInactive:
          preferences.workLimitDuration +
          preferences.workIdleLimitDuration -
          elapsedDuration,
        delayStartCycle: 35000, //calcular
      })
    } else if (preferences.lastState === this.stateMachineFacade.breakState) {
      const lastBreakStartTime = new Date(preferences.lastBreakStartTime)
      const lastPauseStartTime = new Date(preferences.lastPauseStartTime)
      const elapsedDuration =
        lastBreakStartTime.getMilliseconds() -
        lastPauseStartTime.getMilliseconds()

      console.log(
        '[DEBUG] - BREAK_STATE - elapsed duration: ',
        elapsedDuration,
        'ms'
      )

      this.schedulingFacade.scheduleNextWorkNotification({
        userId,
        fcmToken: preferences.fcmToken,
        delay: preferences.breakDuration - elapsedDuration,
      })

      this.schedulingFacade.scheduleBreakIdleAction({
        userId,
        fcmToken: preferences.fcmToken,
        delay: preferences.breakLimitDuration - elapsedDuration,
        delayToInactive:
          preferences.breakLimitDuration +
          preferences.breakIdleLimitDuration -
          elapsedDuration,
        delayStartCycle: 35000, //calcular
      })
    }

    return {
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
    }
  }
}

export default ResumeTimerUseCase
