class ResumeTimerUseCase {
  constructor({ userRepository, stateMachineFacade, schedulingFacade }) {
    this.userRepository = userRepository
    this.stateMachineFacade = stateMachineFacade
    this.schedulingFacade = schedulingFacade
  }

  dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

    return Math.floor((utc2 - utc1) / _MS_PER_DAY)
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
      const lastWorkStartTime = new Date.parse(
        preferences.lastWorkStartTime
      ).getTime()
      const lastPauseStartTime = new Date.parse(
        preferences.lastPauseStartTime
      ).getTime()
      const elapsedDuration = (lastWorkStartTime = lastPauseStartTime)

      this.schedulingFacade.scheduleNextBreakNotification({
        userId,
        fcmToken: preferences.fcmToken,
        delay: 5000 ?? preferences.workDuration - elapsedDuration,
      })

      this.schedulingFacade.scheduleWorkIdleAction({
        userId,
        fcmToken: preferences.fcmToken,
        delay: 15000 ?? preferences.workLimitDuration - elapsedDuration,
        delayToInactive:
          25000 ??
          preferences.workLimitDuration +
            preferences.workIdleLimitDuration -
            elapsedDuration,
        delayStartCycle: 35000, //calcular
      })
    } else if (preferences.lastState === this.stateMachineFacade.breakState) {
      const lastBreakStartTime = new Date.parse(
        preferences.lastBreakStartTime
      ).getTime()
      const lastPauseStartTime = new Date.parse(
        preferences.lastPauseStartTime
      ).getTime()
      const elapsedDuration = (lastBreakStartTime = lastPauseStartTime)

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
