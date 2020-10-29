import db from '../orm/models'

class PushMessageRepository {
  async getPushMessagesByName({ name }) {
    return await db.PushMessage.findAll({
      where: {
        name,
      },
    })
  }
}

export default PushMessageRepository
