import HttpResponse from '../core/http-response'

class TimerPreferencesController {
  constructor(useCases) {
    this.useCases = useCases
  }

  async createUserPreferences(req) {
    const { userId } = req.props

    if (!userId) {
      return HttpResponse.serverError()
    }

    try {
      const { createTimerPreferencesUseCase } = this.useCases
      const preferences = await createTimerPreferencesUseCase.execute(userId)

      if (!preferences) {
        return HttpResponse.ok({
          message: 'User is already subscribed to service',
        })
      } else {
        return HttpResponse.ok({
          message: 'Preferences Created',
          preferences,
        })
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }

  async getTimerPreferences(req) {
    const { userId } = req.props

    try {
      const { getTimerPreferencesUseCase } = this.useCases
      const preferences = await getTimerPreferencesUseCase.execute(userId)

      if (!preferences) {
        return HttpResponse.unauthorizedError()
      } else {
        return HttpResponse.ok({
          message: 'Preferences Retrieved',
          preferences,
        })
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }

  async patchTimerPreferences(req) {
    const {
      startTime,
      breakDuration,
      breakLimitDuration,
      breakIdleLimitDuration,
      workDuration,
      workLimitDuration,
      workIdleLimitDuration,
      pauseLimitDuration,
      pauseIdleLimitDuration,
    } = req.body
    const { userId } = req.props

    try {
      const { patchTimerPreferencesUseCase } = this.useCases
      const preferences = await patchTimerPreferencesUseCase.execute(userId, {
        startTime: startTime,
        breakDuration: breakDuration ? parseInt(breakDuration) : undefined,
        breakLimitDuration: breakLimitDuration
          ? parseInt(breakLimitDuration)
          : undefined,
        breakIdleLimitDuration: breakIdleLimitDuration
          ? parseInt(breakIdleLimitDuration)
          : undefined,
        workDuration: workDuration ? parseInt(workDuration) : undefined,
        workLimitDuration: workLimitDuration
          ? parseInt(workLimitDuration)
          : undefined,
        workIdleLimitDuration: workIdleLimitDuration
          ? parseInt(workIdleLimitDuration)
          : undefined,
        pauseLimitDuration: pauseLimitDuration
          ? parseInt(pauseLimitDuration)
          : undefined,
        pauseIdleLimitDuration: pauseIdleLimitDuration
          ? parseInt(pauseIdleLimitDuration)
          : undefined,
      })

      if (!preferences) {
        return HttpResponse.unauthorizedError()
      } else {
        return HttpResponse.ok({
          message: 'Preferences Patched',
          preferences,
        })
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }

  async deleteTimerPreferences(req) {
    const { userId } = req.props

    try {
      const { deleteTimerPreferencesUseCase } = this.useCases
      const preferences = await deleteTimerPreferencesUseCase.execute(userId)

      if (!preferences) {
        return HttpResponse.ok({
          message: 'User already deleted',
          UserId: userId,
        })
      } else {
        return HttpResponse.ok({
          message: 'Preferences Deleted',
          UserId: userId,
        })
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }
}

export default TimerPreferencesController
