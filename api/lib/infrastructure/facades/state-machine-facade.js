import ServerError from '../../interfaces/core/server-error'
import ClientError from '../../interfaces/core/client-error'

class StateMachineFacade {
  constructor({
    timerPreferencesRepository,
    schedulingFacade,
    analyticsServiceFacade,
    pushMessageRepository,
  }) {
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

  async onStart({ userId }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )
    if (!preferences) throw ClientError.notFound('Subscription Not Found')

    //operation is blocked
    if (!this.canStartFrom(preferences.currentState)) {
      return {
        status: {
          lastState: preferences.lastState,
          currentState: preferences.currentState,
        },
        success: false,
      }
    }

    const [pushMessage, patchedPreferences] = await Promise.all([
      this.pushMessageRepository.getPushMessagesByName({
        name: 'NEXT_BREAK',
      }),

      this.timerPreferencesRepository.patchTimerPreferences(userId, {
        lastWorkStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.workState,
      }),

      this.analyticsServiceFacade.logStartCycle({ userId }),
      this.schedulingFacade.removeJobsOnNotificationQueue({ userId }),
      this.schedulingFacade.removeJobsOnStateQueue({ userId }),
    ])

    this.analyticsServiceFacade.logWork({ userId })

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
      state: this.workIdleState,
      delay: preferences.workLimitDuration,
    })

    return {
      status: {
        lastState: patchedPreferences.lastState,
        currentState: patchedPreferences.currentState,
        millisecondsToStartCycle: null,
        millisecondsToNextBreak: preferences.workDuration,
        millisecondsToNextWork: null,
        millisecondsToBreakIdle: null,
        millisecondsToWorkIdle: preferences.workLimitDuration,
        millisecondsToPauseIdle: null,
        millisecondsToInactive: millisecondsToInactive,
      },
      success: true,
    }
  }

  async onFinish({ userId, fromIdleState }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )
    if (!preferences) throw ClientError.notFound('Subscription Not Found')

    //operation is blocked
    if (!fromIdleState) {
      if (!this.canFinishFrom(preferences.currentState)) {
        return {
          status: {
            lastState: preferences.lastState,
            currentState: preferences.currentState,
          },
          success: false,
        }
      }
    }

    const [pushMessage, patchedPreferences] = await Promise.all([
      this.pushMessageRepository.getPushMessagesByName({
        name: 'START_CYCLE',
      }),

      this.timerPreferencesRepository.patchTimerPreferences(userId, {
        lastState: preferences.currentState,
        currentState: this.inactiveState,
      }),

      this.analyticsServiceFacade.logFinish({ userId }),
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
      delay: millisecondsToStartCycle, //DEBUG: Retirar o '?? delay' para iniciar no próximo dia
    })

    return {
      status: {
        lastState: patchedPreferences.lastState,
        currentState: patchedPreferences.currentState,
        millisecondsToStartCycle: millisecondsToStartCycle,
        millisecondsToNextBreak: null,
        millisecondsToNextWork: null,
        millisecondsToBreakIdle: null,
        millisecondsToWorkIdle: null,
        millisecondsToPauseIdle: null,
        millisecondsToInactive: null,
      },
      success: true,
    }
  }

  async onWork({ userId, elapsedDuration }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )
    if (!preferences) throw ClientError.notFound('Subscription Not Found')

    //operation is blocked
    if (!elapsedDuration) {
      if (!this.canWorkFrom(preferences.currentState)) {
        return {
          status: {
            lastState: preferences.lastState,
            currentState: preferences.currentState,
          },
          success: false,
        }
      }
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

      this.analyticsServiceFacade.logWork({ userId }),
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
      state: this.workIdleState,
      delay: millisecondsToWorkIdle,
    })

    return {
      status: {
        lastState: patchedPreferences.lastState,
        currentState: patchedPreferences.currentState,
        millisecondsToStartCycle: null,
        millisecondsToNextBreak: millisecondsToNextBreak,
        millisecondsToNextWork: null,
        millisecondsToBreakIdle: null,
        millisecondsToWorkIdle: millisecondsToWorkIdle,
        millisecondsToPauseIdle: null,
        millisecondsToInactive: millisecondsToInactive,
      },
      success: true,
    }
  }

  async onBreak({ userId, elapsedDuration }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )
    if (!preferences) throw ClientError.notFound('Subscription Not Found')

    //operation is blocked
    if (!elapsedDuration) {
      if (!this.canBreakFrom(preferences.currentState)) {
        return {
          status: {
            lastState: preferences.lastState,
            currentState: preferences.currentState,
          },
          success: false,
        }
      }
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

      this.analyticsServiceFacade.logBreak({ userId }),
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
      state: this.breakIdleState,
      delay: millisecondsToBreakIdle,
    })

    return {
      status: {
        lastState: patchedPreferences.lastState,
        currentState: patchedPreferences.currentState,
        millisecondsToStartCycle: null,
        millisecondsToNextBreak: null,
        millisecondsToNextWork: millisecondsToNextWork,
        millisecondsToBreakIdle: millisecondsToBreakIdle,
        millisecondsToWorkIdle: null,
        millisecondsToPauseIdle: null,
        millisecondsToInactive: millisecondsToInactive,
      },
      success: true,
    }
  }

  async onPause({ userId }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )
    if (!preferences) throw ClientError.notFound('Subscription Not Found')

    //operation is blocked
    if (!this.canPauseFrom(preferences.currentState)) {
      return {
        status: {
          lastState: preferences.lastState,
          currentState: preferences.currentState,
        },
        success: false,
      }
    }

    const [patchedPreferences] = await Promise.all([
      this.timerPreferencesRepository.patchTimerPreferences(userId, {
        lastPauseStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.pauseState,
      }),

      this.analyticsServiceFacade.logPause({ userId }),
      this.schedulingFacade.removeJobsOnNotificationQueue({ userId }),
      this.schedulingFacade.removeJobsOnStateQueue({ userId }),
    ])

    const millisecondsToInactive =
      preferences.pauseLimitDuration + preferences.pauseIdleLimitDuration

    //PAUSE_IDLE
    this.schedulingFacade.scheduleState({
      userId: userId,
      state: this.pauseIdleState,
      delay: preferences.pauseLimitDuration,
    })

    return {
      status: {
        lastState: patchedPreferences.lastState,
        currentState: patchedPreferences.currentState,
        millisecondsToStartCycle: null,
        millisecondsToNextBreak: null,
        millisecondsToNextWork: null,
        millisecondsToBreakIdle: null,
        millisecondsToWorkIdle: null,
        millisecondsToPauseIdle: preferences.pauseLimitDuration,
        millisecondsToInactive: millisecondsToInactive,
      },
      success: true,
    }
  }

  async onResume({ userId }) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )
    if (!preferences) throw ClientError.notFound('Subscription Not Found')

    //operation is blocked
    if (!this.canResumeFrom(preferences.currentState)) {
      return {
        status: {
          lastState: preferences.lastState,
          currentState: preferences.currentState,
        },
        success: false,
      }
    }

    const [] = await Promise.all([
      this.analyticsServiceFacade.logResume({ userId }),
    ])

    if (preferences.lastState === this.workState) {
      const lastPauseStartTime = new Date(preferences.lastPauseStartTime)
      const lastWorkStartTime = new Date(preferences.lastWorkStartTime)
      const elapsedDuration =
        lastPauseStartTime.getTime() - lastWorkStartTime.getTime()

      return this.onWork({
        userId,
        elapsedDuration,
      })
    } else if (preferences.lastState === this.breakState) {
      const lastPauseStartTime = new Date(preferences.lastPauseStartTime)
      const lastBreakStartTime = new Date(preferences.lastBreakStartTime)
      const elapsedDuration =
        lastPauseStartTime.getTime() - lastBreakStartTime.getTime()

      return this.onBreak({
        userId,
        elapsedDuration,
      })
    }
  }

  async onWorkIdle({ userId }) {
    const [preferences, pushMessage, patchedPreferences] = await Promise.all([
      this.timerPreferencesRepository.getTimerPreferences(userId),

      this.pushMessageRepository.getPushMessagesByName({
        name: 'WORK_IDLE',
      }),

      this.timerPreferencesRepository.patchTimerPreferences(userId, {
        currentState: this.workIdleState,
      }),

      this.analyticsServiceFacade.logWorkIdle({ userId }),
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
      state: this.inactiveState,
      delay: preferences.workIdleLimitDuration,
    })
  }

  async onBreakIdle({ userId }) {
    const [preferences, pushMessage, patchedPreferences] = await Promise.all([
      this.timerPreferencesRepository.getTimerPreferences(userId),

      this.pushMessageRepository.getPushMessagesByName({
        name: 'BREAK_IDLE',
      }),

      this.timerPreferencesRepository.patchTimerPreferences(userId, {
        currentState: this.breakIdleState,
      }),

      this.analyticsServiceFacade.logBreakIdle({ userId }),
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
      state: this.inactiveState,
      delay: preferences.breakIdleLimitDuration,
    })
  }

  async onPauseIdle({ userId }) {
    const [preferences, pushMessage, patchedPreferences] = await Promise.all([
      this.timerPreferencesRepository.getTimerPreferences(userId),

      this.pushMessageRepository.getPushMessagesByName({
        name: 'PAUSE_IDLE',
      }),

      this.timerPreferencesRepository.patchTimerPreferences(userId, {
        currentState: this.pauseIdleState,
      }),

      this.analyticsServiceFacade.logPauseIdle({ userId }),
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
      state: this.inactiveState,
      delay: preferences.pauseIdleLimitDuration,
    })
  }

  async onInactive({ userId }) {
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

      this.analyticsServiceFacade.logInactive({ userId }),
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

    this.onFinish({ userId, fromIdleState: true })
  }

  async onStatus({ userId }) {
    const [preferences] = await Promise.all([
      this.timerPreferencesRepository.getTimerPreferences(userId),
    ])

    if (!preferences) throw ClientError.notFound('Subscription Not Found')

    var millisecondsToStartCycle = null
    var millisecondsToNextBreak = null
    var millisecondsToNextWork = null
    var millisecondsToBreakIdle = null
    var millisecondsToWorkIdle = null
    var millisecondsToPauseIdle = null
    var millisecondsToInactive = null

    const nowTimestamp = new Date().getTime()

    const lastWorkTimestamp = new Date(preferences.lastWorkStartTime).getTime()
    const lastBreakTimestamp = new Date(
      preferences.lastBreakStartTime
    ).getTime()
    const lastPauseTimestamp = new Date(
      preferences.lastPauseStartTime
    ).getTime()

    const workDuration = preferences.workDuration
    const workLimitDuration = preferences.workLimitDuration
    const workIdleLimitDuration = preferences.workIdleLimitDuration

    const breakDuration = preferences.breakDuration
    const breakLimitDuration = preferences.breakLimitDuration
    const breakIdleLimitDuration = preferences.breakIdleLimitDuration

    const pauseLimitDuration = preferences.pauseLimitDuration
    const pauseIdleLimitDuration = preferences.pauseIdleLimitDuration

    switch (preferences.currentState) {
      case this.workState:
        // const lastPauseStartTime = new Date(preferences.lastPauseStartTime)
        // const lastWorkStartTime = new Date(preferences.lastWorkStartTime)
        // const elapsedDuration =
        //   lastPauseStartTime.getTime() - lastWorkStartTime.getTime()

        break
      case this.breakState:
        break
      case this.pauseState:
        break
      case this.workIdleState:
        break
      case this.breakIdleState:
        break
      case this.pauseIdleState:
        break

      default:
        break
    }

    // const nowTimestamp = new Date().getTime()
    // const lastBreakTs = new Date(preferences.lastBreakStartTime).getTime()
    // const lastWorkTs = new Date(preferences.lastWorkStartTime).getTime()
    // const lastPauseTs = new Date(preferences.lastPauseStartTime).getTime()

    //TODO: - calculate responses
    return {
      lastState: preferences.lastState,
      currentState: preferences.currentState,
      millisecondsToStartCycle,
      millisecondsToNextBreak,
      millisecondsToNextWork,
      millisecondsToBreakIdle,
      millisecondsToWorkIdle,
      millisecondsToPauseIdle,
      millisecondsToInactive,
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
