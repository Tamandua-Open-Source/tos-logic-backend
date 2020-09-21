import IStateMachineFacade from '../../application/facade-interfaces/i-state-machine-facade'

class StateMachineFacade extends IStateMachineFacade {
  constructor({ userRepository, schedulingFacade }) {
    super()
    this.userRepository = userRepository
    this.schedulingFacade = schedulingFacade

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
    const preferences = await this.userRepository.getUserPreferences(userId)

    if (!this.canStartFrom(preferences.currentState)) {
      return null
    }

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastWorkStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.workState,
      }
    )

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //NEXT_BREAK
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: '🚨 Policia da ergonomia',
      body: 'Você está sendo conduzido a tirar um break. 💔',
      category: 'UN_BREAK_START_CATEGORY',
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
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
      millisecondsToNextBreak: preferences.workDuration,
    }
  }

  async onFinish({ userId }) {
    const preferences = await this.userRepository.getUserPreferences(userId)

    if (!this.canFinishFrom(preferences.currentState)) {
      return null
    }

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastState: preferences.currentState,
        currentState: this.inactiveState,
      }
    )

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    const delay = this.getMillisecondsToNextStartCycleDate({
      startDate:
        preferences.startTime ?? preferences.UserPreferenceStartPeriod.startsAt,
    })

    //START_CYCLE
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: '🥰 Bom dia flor do dia',
      body: 'Vamos começar o seu ciclo de trabalho de hoje? ❤️',
      category: 'UN_START_CATEGORY',
      fcmToken: preferences.fcmToken,
      delay: 5000 ?? delay, //DEBUG: Retirar o '?? delay' para iniciar no próximo dia
    })

    return {
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
      millisecondsToStartCycle: delay,
    }
  }

  async onWork({ userId, elapsedDuration }) {
    const preferences = await this.userRepository.getUserPreferences(userId)

    console.log('onWork', elapsedDuration)

    if (!elapsedDuration) {
      if (!this.canWorkFrom(preferences.currentState)) {
        return null
      }
    }

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastWorkStartTime: !elapsedDuration ? new Date() : undefined,
        lastState: preferences.currentState,
        currentState: this.workState,
      }
    )

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //NEXT_BREAK
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: '🚨 Policia da ergonomia',
      body: 'Você está sendo conduzido a tirar um break. 💔',
      category: 'UN_BREAK_START_CATEGORY',
      fcmToken: preferences.fcmToken,
      delay: preferences.workDuration - (elapsedDuration ?? 0),
    })

    //WORK_IDLE
    this.schedulingFacade.scheduleState({
      userId: userId,
      state: this.workIdleState,
      delay: preferences.workLimitDuration - (elapsedDuration ?? 0),
    })

    return {
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
      millisecondsToNextBreak:
        preferences.workDuration - (elapsedDuration ?? 0),
    }
  }

  async onBreak({ userId, elapsedDuration }) {
    const preferences = await this.userRepository.getUserPreferences(userId)

    console.log('onBreak', elapsedDuration)

    if (!elapsedDuration) {
      if (!this.canBreakFrom(preferences.currentState)) {
        return null
      }
    }

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastBreakStartTime: !elapsedDuration ? new Date() : undefined,
        lastState: preferences.currentState,
        currentState: this.breakState,
      }
    )

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //NEXT_WORK
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: '💼 Seu advogado conseguiu!',
      body: 'Habeas corpus liberado, pode voltar a trabalhar. 🤎',
      category: 'UN_BREAK_END_CATEGORY',
      fcmToken: preferences.fcmToken,
      delay: preferences.breakDuration - (elapsedDuration ?? 0),
    })

    //BREAK_IDLE
    this.schedulingFacade.scheduleState({
      userId: userId,
      state: this.breakIdleState,
      delay: preferences.breakLimitDuration - (elapsedDuration ?? 0),
    })

    return {
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
      millisecondsToNextWork:
        preferences.breakDuration - (elapsedDuration ?? 0),
    }
  }

  async onPause({ userId }) {
    const preferences = await this.userRepository.getUserPreferences(userId)

    if (!this.canPauseFrom(preferences.currentState)) {
      return null
    }

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastPauseStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: this.pauseState,
      }
    )

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //PAUSE_IDLE
    this.schedulingFacade.scheduleState({
      userId: userId,
      state: this.pauseIdleState,
      delay: preferences.pauseLimitDuration,
    })

    return {
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
      millisecondsToPauseIdle: preferences.pauseLimitDuration,
    }
  }

  async onResume({ userId }) {
    const preferences = await this.userRepository.getUserPreferences(userId)

    if (!this.canResumeFrom(preferences.currentState)) {
      return null
    }

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
    const preferences = await this.userRepository.getUserPreferences(userId)

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        currentState: this.workIdleState,
      }
    )

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //WORK_IDLE
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: '⚠️⚠️⚠️',
      body: 'Você esqueceu de tirar um descanso!!! 🧡',
      category: 'UN_BREAK_START_CATEGORY',
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
    const preferences = await this.userRepository.getUserPreferences(userId)

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        currentState: this.breakIdleState,
      }
    )

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //BREAK_IDLE
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: '⚠️⚠️⚠️',
      body: 'Você esqueceu de voltar a trabalhar!!! 💜',
      category: 'UN_BREAK_END_CATEGORY',
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
    const preferences = await this.userRepository.getUserPreferences(userId)

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        currentState: this.pauseIdleState,
      }
    )

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //PAUSE_IDLE
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: '⚠️⚠️⚠️',
      body: 'Você esqueceu o timer pausado!!! 💚',
      category: 'UN_DEFAULT_CATEGORY',
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
    const preferences = await this.userRepository.getUserPreferences(userId)

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastState: preferences.currentState,
        currentState: this.inactiveState,
      }
    )

    await this.schedulingFacade.removeJobsOnNotificationQueue({ userId })
    await this.schedulingFacade.removeJobsOnStateQueue({ userId })

    //INACTIVE
    this.schedulingFacade.scheduleNotification({
      userId: userId,
      title: '🚫🚫🚫',
      body: 'Você me esqueceu mesmo né. Até amanhã então...',
      category: 'UN_DEFAULT_CATEGORY',
      fcmToken: preferences.fcmToken,
      delay: 0,
    })

    this.onFinish({ userId })
  }

  async onStatus({ userId }) {
    const preferences = await this.userRepository.getUserPreferences(userId)

    const nowTimestamp = new Date().getTime()
    const lastBreakTs = new Date(preferences.lastBreakStartTime).getTime()
    const lastWorkTs = new Date(preferences.lastWorkStartTime).getTime()
    const lastPauseTs = new Date(preferences.lastPauseStartTime).getTime()

    if ([this.inactiveState].includes(preferences.currentState)) {
      //calcular time to nextCycle
      return {
        currentState: preferences.currentState,
        millisecondsToStartCycle: 0,
      }
    }

    if (
      [this.breakIdleState, this.workIdleState, this.pauseIdleState].includes(
        preferences.currentState
      )
    ) {
      return {
        currentState: preferences.currentState,
        millisecondsToInactive: 0,
      }
    }

    if ([this.workState].includes(preferences.currentState)) {
      return {
        currentState: preferences.currentState,
        millisecondsToNextBreak: 0,
        millisecondsToWorkIdle: 0,
      }
    }

    if ([this.breakState].includes(preferences.currentState)) {
      return {
        currentState: preferences.currentState,
        millisecondsToNextBreak: 0,
        millisecondsToBreakIdle: 0,
      }
    }

    if ([this.pauseState].includes(preferences.currentState)) {
      return {
        currentState: preferences.currentState,
        millisecondsToPauseIdle: 0,
      }
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

// "id": -1,
// "UserId": "vN7Kodp84zQg1KDTPd3IfwvaF1r1",
// "UserPreferenceTimeTypeId": 2,
// "UserPreferenceStartPeriodId": 1,
// "fcmToken": "fB_deuQbPkTOsFUPrb_I45:APA91bHP6kNOOahgukAMDSMF9ppuOD832iN0204CJG_COQHC9HQW5cqTlR9zxPLtQXYXdragbmnmqI8rE2O9KJSN-vpN_AWyC5dv78f7VwKPCPkRRV97f0xMie8DLIP0ak0nNUqoRCu2",
// "startTime": null,
// "breakDuration": 5000,
// "breakLimitDuration": 15000,
// "breakIdleLimitDuration": 10000,
// "lastBreakStartTime": "2020-09-21T13:38:03.942Z",
// "workDuration": 5000,
// "workLimitDuration": 15000,
// "workIdleLimitDuration": 10000,
// "lastWorkStartTime": "2020-09-21T13:38:03.942Z",
// "pauseLimitDuration": 15000,
// "pauseIdleLimitDuration": 10000,
// "lastPauseStartTime": "2020-09-21T13:38:03.942Z",
// "currentState": "INACTIVE",
// "lastState": "INACTIVE",
// "createdAt": "2020-09-21T13:38:03.942Z",
// "updatedAt": "2020-09-21T13:38:03.942Z",
