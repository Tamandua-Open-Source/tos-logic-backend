import IStateMachineFacade from '../../application/facade-interfaces/i-state-machine-facade'

class StateMachineFacade extends IStateMachineFacade {
  constructor({
    timerPreferencesRepository,
    schedulingFacade,
    userDataFacade,
    analyticsServiceFacade,
    pushMessageRepository,
  }) {
    super()
    this.timerPreferencesRepository = timerPreferencesRepository
    this.schedulingFacade = schedulingFacade
    this.userDataFacade = userDataFacade
    this.analyticsServiceFacade = analyticsServiceFacade
    this.pushMessageRepository = pushMessageRepository

    this.inactiveState = 'INACTIVE'
    this.workState = 'WORK'
    this.breakState = 'BREAK'
    this.pauseState = 'PAUSE'
    this.workIdleState = 'WORK_IDLE'
    this.breakIdleState = 'BREAK_IDLE'
    this.pauseIdleState = 'PAUSE_IDLE'
  }

  canStartFrom(currentState) {
    return [this.inactiveState].includes(currentState)
  }

  canFinishFrom(currentState) {
    return [
      this.workState,
      this.workIdleState,
      this.pauseState,
      this.pauseIdleState,
      this.breakState,
      this.breakIdleState,
    ].includes(currentState)
  }

  canWorkFrom(currentState) {
    return [this.breakState, this.breakIdleState].includes(currentState)
  }

  canBreakFrom(currentState) {
    return [this.workState, this.workIdleState].includes(currentState)
  }

  canPauseFrom(currentState) {
    return [this.workState, this.breakState].includes(currentState)
  }

  canResumeFrom(currentState) {
    return [this.pauseState, this.pauseIdleState].includes(currentState)
  }

  async onStart({ userId, idToken }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    const pushMessage = await this.pushMessageRepository.getPushMessagesByName({
      name: 'NEXT_BREAK',
    })

    const userData = await this.userDataFacade.getUserData(userId)

    if (!this.canStartFrom(preferences.currentState)) {
      return null
    }

    const patchedPreferences = await this.timerPreferencesRepository.patchTimerPreferences(
      userId,
      {
        lastWorkStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.workState,
      }
    )

    await this.analyticsServiceFacade.logStartCycle({ idToken })

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //NEXT_BREAK
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: userData.fcmToken,
      delay: preferences.workDuration,
    })

    //WORK_IDLE
    this.schedulingFacade.scheduleState({
      userId: userId,
      idToken: idToken,
      state: this.workIdleState,
      delay: preferences.workLimitDuration,
    })

    return {
      lastState: patchedPreferences.lastState,
      currentState: patchedPreferences.currentState,
      millisecondsToStartCycle: null,
      millisecondsToNextBreak: preferences.workDuration,
      millisecondsToNextWork: null,
      millisecondsToBreakIdle: null,
      millisecondsToWorkIdle: null,
      millisecondsToPauseIdle: null,
      millisecondsToInactive: null,
    }
  }

  async onFinish({ userId, idToken }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    const pushMessage = await this.pushMessageRepository.getPushMessagesByName({
      name: 'START_CYCLE',
    })

    const userData = await this.userDataFacade.getUserData(userId)

    if (!this.canFinishFrom(preferences.currentState)) {
      return null
    }

    const patchedPreferences = await this.timerPreferencesRepository.patchTimerPreferences(
      userId,
      {
        lastState: preferences.currentState,
        currentState: this.inactiveState,
      }
    )

    await this.analyticsServiceFacade.logFinish({ idToken })

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    const delay = this.getMillisecondsToNextStartCycleDate({
      startDate: preferences.startTime,
    })

    //START_CYCLE
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: userData.fcmToken,
      delay: 5000 ?? delay, //DEBUG: Retirar o '?? delay' para iniciar no próximo dia
    })

    return {
      lastState: patchedPreferences.lastState,
      currentState: patchedPreferences.currentState,
      millisecondsToStartCycle: delay,
      millisecondsToNextBreak: null,
      millisecondsToNextWork: null,
      millisecondsToBreakIdle: null,
      millisecondsToWorkIdle: null,
      millisecondsToPauseIdle: null,
      millisecondsToInactive: null,
    }
  }

  async onWork({ userId, idToken, elapsedDuration }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    const pushMessage = await this.pushMessageRepository.getPushMessagesByName({
      name: 'NEXT_BREAK',
    })

    const userData = await this.userDataFacade.getUserData(userId)

    console.log('onWork', elapsedDuration)

    if (!elapsedDuration) {
      if (!this.canWorkFrom(preferences.currentState)) {
        return null
      }
    }

    const patchedPreferences = await this.timerPreferencesRepository.patchTimerPreferences(
      userId,
      {
        lastWorkStartTime: !elapsedDuration ? new Date() : undefined,
        lastState: preferences.currentState,
        currentState: this.workState,
      }
    )

    await this.analyticsServiceFacade.logWork({ idToken })

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //NEXT_BREAK
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: userData.fcmToken,
      delay: preferences.workDuration - (elapsedDuration ?? 0),
    })

    //WORK_IDLE
    this.schedulingFacade.scheduleState({
      userId: userId,
      idToken: idToken,
      state: this.workIdleState,
      delay: preferences.workLimitDuration - (elapsedDuration ?? 0),
    })

    return {
      lastState: patchedPreferences.lastState,
      currentState: patchedPreferences.currentState,
      millisecondsToStartCycle: null,
      millisecondsToNextBreak:
        preferences.workDuration - (elapsedDuration ?? 0),
      millisecondsToNextWork: null,
      millisecondsToBreakIdle: null,
      millisecondsToWorkIdle: null,
      millisecondsToPauseIdle: null,
      millisecondsToInactive: null,
    }
  }

  async onBreak({ userId, idToken, elapsedDuration }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    const pushMessage = await this.pushMessageRepository.getPushMessagesByName({
      name: 'NEXT_WORK',
    })

    const userData = await this.userDataFacade.getUserData(userId)

    if (!elapsedDuration) {
      if (!this.canBreakFrom(preferences.currentState)) {
        return null
      }
    }

    const patchedPreferences = await this.timerPreferencesRepository.patchTimerPreferences(
      userId,
      {
        lastBreakStartTime: !elapsedDuration ? new Date() : undefined,
        lastState: preferences.currentState,
        currentState: this.breakState,
      }
    )

    await this.analyticsServiceFacade.logBreak({ idToken })

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //NEXT_WORK
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: userData.fcmToken,
      delay: preferences.breakDuration - (elapsedDuration ?? 0),
    })

    //BREAK_IDLE
    this.schedulingFacade.scheduleState({
      userId: userId,
      idToken: idToken,
      state: this.breakIdleState,
      delay: preferences.breakLimitDuration - (elapsedDuration ?? 0),
    })

    return {
      lastState: patchedPreferences.lastState,
      currentState: patchedPreferences.currentState,
      millisecondsToStartCycle: null,
      millisecondsToNextBreak: null,
      millisecondsToNextWork:
        preferences.breakDuration - (elapsedDuration ?? 0),
      millisecondsToBreakIdle: null,
      millisecondsToWorkIdle: null,
      millisecondsToPauseIdle: null,
      millisecondsToInactive: null,
    }
  }

  async onPause({ userId, idToken }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    if (!this.canPauseFrom(preferences.currentState)) {
      return null
    }

    const patchedPreferences = await this.timerPreferencesRepository.patchTimerPreferences(
      userId,
      {
        lastPauseStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.pauseState,
      }
    )

    await this.analyticsServiceFacade.logPause({ idToken })

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //PAUSE_IDLE
    this.schedulingFacade.scheduleState({
      userId: userId,
      idToken: idToken,
      state: this.pauseIdleState,
      delay: preferences.pauseLimitDuration,
    })

    return {
      lastState: patchedPreferences.lastState,
      currentState: patchedPreferences.currentState,
      millisecondsToStartCycle: null,
      millisecondsToNextBreak: null,
      millisecondsToNextWork: null,
      millisecondsToBreakIdle: null,
      millisecondsToWorkIdle: null,
      millisecondsToPauseIdle: preferences.pauseLimitDuration,
      millisecondsToInactive: null,
    }
  }

  async onResume({ userId, idToken }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    if (!this.canResumeFrom(preferences.currentState)) {
      return null
    }

    await this.analyticsServiceFacade.logResume({ idToken })

    if (preferences.lastState === this.workState) {
      const lastPauseStartTime = new Date(preferences.lastPauseStartTime)
      const lastWorkStartTime = new Date(preferences.lastWorkStartTime)
      const elapsedDuration =
        lastPauseStartTime.getTime() - lastWorkStartTime.getTime()

      return this.onWork({
        userId,
        idToken,
        elapsedDuration,
      })
    } else if (preferences.lastState === this.breakState) {
      const lastPauseStartTime = new Date(preferences.lastPauseStartTime)
      const lastBreakStartTime = new Date(preferences.lastBreakStartTime)
      const elapsedDuration =
        lastPauseStartTime.getTime() - lastBreakStartTime.getTime()

      return this.onBreak({
        userId,
        idToken,
        elapsedDuration,
      })
    }
  }

  async onWorkIdle({ userId, idToken }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    const pushMessage = await this.pushMessageRepository.getPushMessagesByName({
      name: 'WORK_IDLE',
    })

    const userData = await this.userDataFacade.getUserData(userId)

    const patchedPreferences = await this.timerPreferencesRepository.patchTimerPreferences(
      userId,
      {
        currentState: this.workIdleState,
      }
    )

    await this.analyticsServiceFacade.logWorkIdle({ idToken })

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //WORK_IDLE
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: userData.fcmToken,
      delay: 0,
    })

    //INACTIVE
    this.schedulingFacade.scheduleState({
      userId: userId,
      idToken: idToken,
      state: this.inactiveState,
      delay: preferences.workIdleLimitDuration,
    })
  }

  async onBreakIdle({ userId, idToken }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    const pushMessage = await this.pushMessageRepository.getPushMessagesByName({
      name: 'BREAK_IDLE',
    })

    const userData = await this.userDataFacade.getUserData(userId)

    const patchedPreferences = await this.timerPreferencesRepository.patchTimerPreferences(
      userId,
      {
        currentState: this.breakIdleState,
      }
    )

    await this.analyticsServiceFacade.logBreakIdle({ idToken })

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //BREAK_IDLE
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: userData.fcmToken,
      delay: 0,
    })

    //INACTIVE
    this.schedulingFacade.scheduleState({
      userId: userId,
      idToken: idToken,
      state: this.inactiveState,
      delay: preferences.breakIdleLimitDuration,
    })
  }

  async onPauseIdle({ userId, idToken }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    const pushMessage = await this.pushMessageRepository.getPushMessagesByName({
      name: 'PAUSE_IDLE',
    })

    const userData = await this.userDataFacade.getUserData(userId)

    const patchedPreferences = await this.timerPreferencesRepository.patchTimerPreferences(
      userId,
      {
        currentState: this.pauseIdleState,
      }
    )

    await this.analyticsServiceFacade.logPauseIdle({ idToken })

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //PAUSE_IDLE
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: userData.fcmToken,
      delay: 0,
    })

    //INACTIVE
    this.schedulingFacade.scheduleState({
      userId: userId,
      idToken: idToken,
      state: this.inactiveState,
      delay: preferences.pauseIdleLimitDuration,
    })
  }

  async onInactive({ userId, idToken }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    const pushMessage = await this.pushMessageRepository.getPushMessagesByName({
      name: 'INACTIVE',
    })

    const userData = await this.userDataFacade.getUserData(userId)

    const patchedPreferences = await this.timerPreferencesRepository.patchTimerPreferences(
      userId,
      {
        lastState: preferences.currentState,
        currentState: this.inactiveState,
      }
    )

    await this.analyticsServiceFacade.logInactive({ idToken })

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //INACTIVE
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: userData.fcmToken,
      delay: 0,
    })

    this.onFinish({ userId })
  }

  async onStatus({ userId, idToken }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    const nowTimestamp = new Date().getTime()
    const lastBreakTs = new Date(preferences.lastBreakStartTime).getTime()
    const lastWorkTs = new Date(preferences.lastWorkStartTime).getTime()
    const lastPauseTs = new Date(preferences.lastPauseStartTime).getTime()

    //TODO: - calculate responses
    return {
      lastState: preferences.lastState,
      currentState: preferences.currentState,
      millisecondsToStartCycle: null,
      millisecondsToNextBreak: null,
      millisecondsToNextWork: null,
      millisecondsToBreakIdle: null,
      millisecondsToWorkIdle: null,
      millisecondsToPauseIdle: null,
      millisecondsToInactive: null,
    }
  }

  getMillisecondsToNextStartCycleDate({ startDate }) {
    const time = new Date(startDate)
    const tomorrowDate = new Date()
    tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1)

    const startCycleDate = new Date()
    startCycleDate.setUTCFullYear(tomorrowDate.getUTCFullYear())
    startCycleDate.setUTCMonth(tomorrowDate.getUTCMonth())
    startCycleDate.setUTCDate(tomorrowDate.getUTCDate())
    startCycleDate.setUTCHours(time.getUTCHours())
    startCycleDate.setUTCMinutes(time.getUTCMinutes())
    startCycleDate.setUTCSeconds(time.getUTCSeconds())
    startCycleDate.setUTCMilliseconds(time.getUTCMilliseconds())

    return startCycleDate.getTime() - new Date().getTime()
  }
}

export default StateMachineFacade
