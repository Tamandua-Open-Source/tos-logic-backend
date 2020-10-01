import { UnimplementedError } from '../../core/errors'

class ITimerPreferencesRepository {
  createTimerPreferences(_userId) {
    throw new UnimplementedError()
  }

  getTimerPreferences(_userId) {
    throw new UnimplementedError()
  }

  patchTimerPreferences(_userId, _updatedFields) {
    throw new UnimplementedError()
  }

  deleteTimerPreferences(_userId) {
    throw new UnimplementedError()
  }
}

export default ITimerPreferencesRepository
