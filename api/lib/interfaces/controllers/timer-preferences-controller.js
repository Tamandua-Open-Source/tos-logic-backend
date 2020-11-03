import HttpResponse from '../core/http-response'
import ServerError from '../core/server-error'
import ClientError from '../core/client-error'

class TimerPreferencesController {
  constructor(useCases) {
    this.useCases = useCases
  }

  async subscribeUserPreferencesByUserId(req) {
    const { userId } = req.params

    if (!userId) throw ClientError.badRequest("Missing 'userId' Path Parameter")

    const { createTimerPreferencesUseCase } = this.useCases
    const preferences = await createTimerPreferencesUseCase.execute(userId)

    if (!preferences)
      return HttpResponse.accepted({
        message: 'User Is Already Subscribed To Service',
      })

    return HttpResponse.created({
      message: 'User Subscribed, Preferences Created',
      preferences,
    })
  }

  async unsubscribeUserPreferencesByUserId(req) {
    const { userId } = req.params

    if (!userId) throw ClientError.badRequest("Missing 'userId' Path Parameter")

    const { deleteTimerPreferencesUseCase } = this.useCases
    const success = await deleteTimerPreferencesUseCase.execute(userId)

    if (!success)
      return HttpResponse.accepted({
        message: 'User Is Already Unubscribed From Service',
        UserId: userId,
      })

    return HttpResponse.ok({
      message: 'User Unubscribed, Preferences Deleted',
      UserId: userId,
    })
  }

  async getTimerPreferences(req) {
    const { userId } = req.props

    const { getTimerPreferencesUseCase } = this.useCases
    const preferences = await getTimerPreferencesUseCase.execute(userId)

    if (!preferences) throw ClientError.notFound()

    return HttpResponse.ok({
      message: 'Preferences Retrieved',
      preferences,
    })
  }

  async createUserPreferences(req) {
    const { userId } = req.props

    if (!userId) throw ServerError.internal()

    const { createTimerPreferencesUseCase } = this.useCases
    const preferences = await createTimerPreferencesUseCase.execute(userId)

    if (!preferences)
      return HttpResponse.accepted({
        message: 'Preferences Already Created',
      })

    return HttpResponse.created({
      message: 'Preferences Created',
      preferences,
    })
  }

  async patchTimerPreferences(req) {
    const {
      fcmToken,
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

    if (!userId) throw ServerError.internal()

    const { patchTimerPreferencesUseCase } = this.useCases
    const preferences = await patchTimerPreferencesUseCase.execute(userId, {
      fcmToken: fcmToken,
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

    if (!preferences) throw ClientError.notFound()

    return HttpResponse.ok({
      message: 'Preferences Patched',
      preferences,
    })
  }

  async deleteTimerPreferences(req) {
    const { userId } = req.props

    if (!userId) throw ServerError.internal()

    const { deleteTimerPreferencesUseCase } = this.useCases
    const success = await deleteTimerPreferencesUseCase.execute(userId)

    if (!success)
      return HttpResponse.accepted({
        message: 'Prefereces Already Deleted',
        UserId: userId,
      })

    return HttpResponse.ok({
      message: 'Preferences Deleted',
      UserId: userId,
    })
  }
}

export default TimerPreferencesController
