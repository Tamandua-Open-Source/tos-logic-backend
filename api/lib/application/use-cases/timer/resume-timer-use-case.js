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

    this.schedulingFacade.removeAllScheduledPushNotifications(userId)
    this.schedulingFacade.removeAllScheduledIdleSystemActions(userId)

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastWorkStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.stateMachineFacade.onResume(preferences.lastState),
      }
    )

    if (preferences.lastState === this.stateMachineFacade.workState) {
      this.schedulingFacade.scheduleNextBreakNotification(
        userId,
        preferences.fcmToken
      )
      this.schedulingFacade.scheduleWorkIdleAction(userId, preferences.fcmToken)
    } else if (preferences.lastState === this.stateMachineFacade.breakState) {
      this.schedulingFacade.scheduleNextWorkNotification(
        userId,
        preferences.fcmToken
      )
      this.schedulingFacade.scheduleBreakIdleAction(
        userId,
        preferences.fcmToken
      )
    }

    return {
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
    }
  }
}

export default ResumeTimerUseCase
