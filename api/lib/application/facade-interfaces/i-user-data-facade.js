import { UnimplementedError } from '../../core/errors'

class IUserDataFacade {
  getUserData(_userId) {
    throw new UnimplementedError()
  }
}

export default IUserDataFacade
