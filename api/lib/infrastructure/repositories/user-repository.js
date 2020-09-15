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
    const preferences = await db.UserPreference.findOne({
      where: {
        UserId: userId,
      },
    })

    if (preferences) {
      return preferences.update(updatedFields)
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
      include: [
        {
          model: db.UserPreferenceWeeklyStretchActivity,
        },
        {
          model: db.UserPreferenceWeeklyWorkActivity,
        },
        {
          model: db.UserPreferenceTimeType,
        },
        {
          model: db.UserPreferenceStartPeriod,
        },
      ],
    })
  }
}

export default UserRepository
