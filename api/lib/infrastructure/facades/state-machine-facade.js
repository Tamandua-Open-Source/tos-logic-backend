import IStateMachineFacade from '../../application/facade-interfaces/i-state-machine-facade'

class StateMachineFacade extends IStateMachineFacade {
  constructor({
    timerPreferencesRepository,
    schedulingFacade,
    analyticsServiceFacade,
    pushMessageRepository,
  }) {
    super()
    this.timerPreferencesRepository = timerPreferencesRepository
    this.schedulingFacade = schedulingFacade
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

    if (!this.canStartFrom(preferences.currentState)) return null

    const [pushMessage, patchedPreferences] = await Promise.all([
      this.pushMessageRepository.getPushMessagesByName({
        name: 'NEXT_BREAK',
      }),

      this.timerPreferencesRepository.patchTimerPreferences(userId, {
        lastWorkStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.workState,
      }),

      this.analyticsServiceFacade.logStartCycle({ idToken }),
      this.schedulingFacade.removeJobsOnNotificationQueue({ userId }),
      this.schedulingFacade.removeJobsOnStateQueue({ userId }),
    ])

    const millisecondsToInactive =
      preferences.workLimitDuration + preferences.workIdleLimitDuration

    //NEXT_BREAK
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: preferences.fcmToken,
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
      millisecondsToWorkIdle: preferences.workLimitDuration,
      millisecondsToPauseIdle: null,
      millisecondsToInactive: millisecondsToInactive,
    }
  }

  async onFinish({ userId, idToken }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    if (!this.canFinishFrom(preferences.currentState)) return null

    const [pushMessage, patchedPreferences] = await Promise.all([
      this.pushMessageRepository.getPushMessagesByName({
        name: 'START_CYCLE',
      }),

      this.timerPreferencesRepository.patchTimerPreferences(userId, {
        lastState: preferences.currentState,
        currentState: this.inactiveState,
      }),

      this.analyticsServiceFacade.logFinish({ idToken }),
      this.schedulingFacade.removeJobsOnNotificationQueue({ userId }),
      this.schedulingFacade.removeJobsOnStateQueue({ userId }),
    ])

    const millisecondsToStartCycle = this.getMillisecondsToNextStartCycleDate({
      startDate: preferences.startTime,
    })

    //START_CYCLE
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: preferences.fcmToken,
      delay: 5000 ?? millisecondsToStartCycle, //DEBUG: Retirar o '?? delay' para iniciar no próximo dia
    })

    return {
      lastState: patchedPreferences.lastState,
      currentState: patchedPreferences.currentState,
      millisecondsToStartCycle: millisecondsToStartCycle,
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

    if (!elapsedDuration) {
      if (!this.canWorkFrom(preferences.currentState)) return null
    }

    const [pushMessage, patchedPreferences] = await Promise.all([
      this.pushMessageRepository.getPushMessagesByName({
        name: 'NEXT_BREAK',
      }),

      this.timerPreferencesRepository.patchTimerPreferences(userId, {
        lastWorkStartTime: !elapsedDuration ? new Date() : undefined,
        lastState: preferences.currentState,
        currentState: this.workState,
      }),

      this.analyticsServiceFacade.logWork({ idToken }),
      this.schedulingFacade.removeJobsOnNotificationQueue({ userId }),
      this.schedulingFacade.removeJobsOnStateQueue({ userId }),
    ])

    const millisecondsToNextBreak =
      preferences.workDuration - (elapsedDuration ?? 0)
    const millisecondsToWorkIdle =
      preferences.workLimitDuration - (elapsedDuration ?? 0)
    const millisecondsToInactive =
      preferences.workLimitDuration +
      preferences.workIdleLimitDuration -
      (elapsedDuration ?? 0)

    //NEXT_BREAK
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: preferences.fcmToken,
      delay: millisecondsToNextBreak,
    })

    //WORK_IDLE
    this.schedulingFacade.scheduleState({
      userId: userId,
      idToken: idToken,
      state: this.workIdleState,
      delay: millisecondsToWorkIdle,
    })

    return {
      lastState: patchedPreferences.lastState,
      currentState: patchedPreferences.currentState,
      millisecondsToStartCycle: null,
      millisecondsToNextBreak: millisecondsToNextBreak,
      millisecondsToNextWork: null,
      millisecondsToBreakIdle: null,
      millisecondsToWorkIdle: millisecondsToWorkIdle,
      millisecondsToPauseIdle: null,
      millisecondsToInactive: millisecondsToInactive,
    }
  }

  async onBreak({ userId, idToken, elapsedDuration }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    if (!elapsedDuration) {
      if (!this.canBreakFrom(preferences.currentState)) return null
    }

    const [pushMessage, patchedPreferences] = await Promise.all([
      this.pushMessageRepository.getPushMessagesByName({
        name: 'NEXT_WORK',
      }),

      this.timerPreferencesRepository.patchTimerPreferences(userId, {
        lastBreakStartTime: !elapsedDuration ? new Date() : undefined,
        lastState: preferences.currentState,
        currentState: this.breakState,
      }),

      this.analyticsServiceFacade.logBreak({ idToken }),
      this.schedulingFacade.removeJobsOnNotificationQueue({ userId }),
      this.schedulingFacade.removeJobsOnStateQueue({ userId }),
    ])

    const millisecondsToNextWork =
      preferences.breakDuration - (elapsedDuration ?? 0)
    const millisecondsToBreakIdle =
      preferences.breakLimitDuration - (elapsedDuration ?? 0)
    const millisecondsToInactive =
      preferences.breakLimitDuration +
      preferences.breakIdleLimitDuration -
      (elapsedDuration ?? 0)

    //NEXT_WORK
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: preferences.fcmToken,
      delay: millisecondsToNextWork,
    })

    //BREAK_IDLE
    this.schedulingFacade.scheduleState({
      userId: userId,
      idToken: idToken,
      state: this.breakIdleState,
      delay: millisecondsToBreakIdle,
    })

    return {
      lastState: patchedPreferences.lastState,
      currentState: patchedPreferences.currentState,
      millisecondsToStartCycle: null,
      millisecondsToNextBreak: null,
      millisecondsToNextWork: millisecondsToNextWork,
      millisecondsToBreakIdle: millisecondsToBreakIdle,
      millisecondsToWorkIdle: null,
      millisecondsToPauseIdle: null,
      millisecondsToInactive: millisecondsToInactive,
    }
  }

  async onPause({ userId, idToken }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    if (!this.canPauseFrom(preferences.currentState)) return null

    const [patchedPreferences] = await Promise.all([
      this.timerPreferencesRepository.patchTimerPreferences(userId, {
        lastPauseStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.pauseState,
      }),

      this.analyticsServiceFacade.logPause({ idToken }),
      this.schedulingFacade.removeJobsOnNotificationQueue({ userId }),
      this.schedulingFacade.removeJobsOnStateQueue({ userId }),
    ])

    const millisecondsToInactive =
      preferences.pauseLimitDuration + preferences.pauseIdleLimitDuration

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
      millisecondsToInactive: millisecondsToInactive,
    }
  }

  async onResume({ userId, idToken }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    if (!this.canResumeFrom(preferences.currentState)) return null

    const [] = await Promise.all([
      this.analyticsServiceFacade.logResume({ idToken }),
    ])

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
    const [preferences, pushMessage, patchedPreferences] = await Promise.all([
      this.timerPreferencesRepository.getTimerPreferences(userId),

      this.pushMessageRepository.getPushMessagesByName({
        name: 'WORK_IDLE',
      }),

      this.timerPreferencesRepository.patchTimerPreferences(userId, {
        currentState: this.workIdleState,
      }),

      this.analyticsServiceFacade.logWorkIdle({ idToken }),
      this.schedulingFacade.removeJobsOnNotificationQueue({ userId }),
      this.schedulingFacade.removeJobsOnStateQueue({ userId }),
    ])

    //WORK_IDLE
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: preferences.fcmToken,
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
    const [preferences, pushMessage, patchedPreferences] = await Promise.all([
      this.timerPreferencesRepository.getTimerPreferences(userId),

      this.pushMessageRepository.getPushMessagesByName({
        name: 'BREAK_IDLE',
      }),

      this.timerPreferencesRepository.patchTimerPreferences(userId, {
        currentState: this.breakIdleState,
      }),

      this.analyticsServiceFacade.logBreakIdle({ idToken }),
      this.schedulingFacade.removeJobsOnNotificationQueue({ userId }),
      this.schedulingFacade.removeJobsOnStateQueue({ userId }),
    ])

    //BREAK_IDLE
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: preferences.fcmToken,
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
    const [preferences, pushMessage, patchedPreferences] = await Promise.all([
      this.timerPreferencesRepository.getTimerPreferences(userId),

      this.pushMessageRepository.getPushMessagesByName({
        name: 'PAUSE_IDLE',
      }),

      this.timerPreferencesRepository.patchTimerPreferences(userId, {
        currentState: this.pauseIdleState,
      }),

      this.analyticsServiceFacade.logPauseIdle({ idToken }),
      this.schedulingFacade.removeJobsOnNotificationQueue({ userId }),
      this.schedulingFacade.removeJobsOnStateQueue({ userId }),
    ])

    //PAUSE_IDLE
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: preferences.fcmToken,
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

    const [pushMessage, patchedPreferences] = await Promise.all([
      this.pushMessageRepository.getPushMessagesByName({
        name: 'INACTIVE',
      }),

      this.timerPreferencesRepository.patchTimerPreferences(userId, {
        lastState: preferences.currentState,
        currentState: this.inactiveState,
      }),

      this.analyticsServiceFacade.logInactive({ idToken }),
      this.schedulingFacade.removeJobsOnNotificationQueue({ userId }),
      this.schedulingFacade.removeJobsOnStateQueue({ userId }),
    ])

    //INACTIVE
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: pushMessage[0].title || '',
      body: pushMessage[0].body || '',
      category: pushMessage[0].category || '',
      fcmToken: preferences.fcmToken,
      delay: 0,
    })

    this.onFinish({ userId })
  }

  async onStatus({ userId, idToken }) {
    const [preferences] = await Promise.all([
      this.timerPreferencesRepository.getTimerPreferences(userId),
    ])

    // const nowTimestamp = new Date().getTime()
    // const lastBreakTs = new Date(preferences.lastBreakStartTime).getTime()
    // const lastWorkTs = new Date(preferences.lastWorkStartTime).getTime()
    // const lastPauseTs = new Date(preferences.lastPauseStartTime).getTime()

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
