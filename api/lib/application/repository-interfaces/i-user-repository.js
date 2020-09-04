import { UnimplementedError } from '../../core/errors'

class IUserRepository {
  getUserById(_userId) {
    throw new UnimplementedError()
  }

  getUserPreferences(_userId) {
    throw new UnimplementedError()
  }

  patchUserPreferences(_userId, _updatedFields) {
    throw new UnimplementedError()
  }
}

export default IUserRepository
