import db from '../orm/models'
import ITimerPreferencesRepository from '../../application/repository-interfaces/i-timer-preferences-repository'

class TimerPreferencesRepository extends ITimerPreferencesRepository {
  async createTimerPreferences(userId) {
    return await db.TimerPreference.create({
      UserId: userId,
      startTime: new Date(),
      breakDuration: 5000,
      breakLimitDuration: 15000,
      breakIdleLimitDuration: 10000,
      lastBreakStartTime: new Date(),
      workDuration: 5000,
      workLimitDuration: 15000,
      workIdleLimitDuration: 10000,
      lastWorkStartTime: new Date(),
      pauseLimitDuration: 15000,
      pauseIdleLimitDuration: 10000,
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

    if (!timerPreferences) return null

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
