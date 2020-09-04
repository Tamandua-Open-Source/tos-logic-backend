import db from '../orm/models'
import IUserRepository from '../../application/repository-interfaces/i-user-repository'

class UserRepository extends IUserRepository {
  async getUserById(userId) {
    return await db.User.findOne({
      where: {
        id: userId,
      },
    })
  }

  async patchUserPreferences(userId, updatedFields) {
    const preferences = db.UserPreference.findOne({
      where: {
        UserId: userId,
      },
    })

    if (preferences) {
      return await preferences.update({ updatedFields })
    }

    return null
  }

  async getUserPreferences(userId) {
    const user = await this.getUserById(userId)

    if (!user) {
      return null
    }

    return await db.UserPreference.findOne({
      where: {
        UserId: userId,
      },
      attributes: ['startTime', 'breakDuration', 'workDuration'],
      include: [
        {
          model: db.UserPreferenceWeeklyStretchActivity,
          attributes: [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
          ],
        },
        {
          model: db.UserPreferenceWeeklyWorkActivity,
          attributes: [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
          ],
        },
        {
          model: db.UserPreferenceTimeType,
          attributes: ['id', 'name'],
        },
        {
          model: db.UserPreferenceStartPeriod,
          attributes: ['id', 'name', 'startsAt', 'endsAt'],
        },
      ],
    })
  }
}

export default UserRepository
