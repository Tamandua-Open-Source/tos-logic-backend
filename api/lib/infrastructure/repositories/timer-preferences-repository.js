import db from '../orm/models'
import ServerError from '../../interfaces/core/server-error'
import ClientError from '../../interfaces/core/client-error'

class TimerPreferencesRepository {
  async createTimerPreferences(userId) {
    return await db.TimerPreference.create({
      UserId: userId,
      fcmToken: null,
      startTime: new Date(),
      allowTimerNotifications: true,
      breakDuration: 900000, // 15 min
      breakLimitDuration: 1200000, // 20 min
      breakIdleLimitDuration: 300000, // 5 min
      lastBreakStartTime: new Date(),
      workDuration: 5400000, // 90 min
      workLimitDuration: 6000000, //100 min
      workIdleLimitDuration: 600000, //10 min
      lastWorkStartTime: new Date(),
      pauseLimitDuration: 3600000, // 60 min
      pauseIdleLimitDuration: 5400000, //90 min
      lastPauseStartTime: new Date(),
      currentState: 'INACTIVE',
      lastState: 'INACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  async getTimerPreferences(userId) {
    return await db.TimerPreference.findOne({
      where: {
        UserId: userId,
      },
    })
  }

  async patchTimerPreferences(userId, updatedFields) {
    const timerPreferences = await db.TimerPreference.findOne({
      where: {
        UserId: userId,
      },
    })

    if (!timerPreferences)
      throw ClientError.notFound('Timer Preferences Not Found')

    return await timerPreferences.update(updatedFields)
  }

  async deleteTimerPreferences(userId) {
    return await db.TimerPreference.destroy({
      where: {
        UserId: userId,
      },
    })
  }
}

export default TimerPreferencesRepository
