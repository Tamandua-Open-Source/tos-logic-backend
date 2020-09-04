import UserRepository from '../../../infrastructure/repositories/user-repository'
import UserController from '../user-controller'
import { GetUserUseCase } from '../../../application/use-cases/users'

class UserControllerComposer {
  static compose() {
    const userRepository = new UserRepository()

    const getUserUseCase = new GetUserUseCase({ userRepository })

    return new UserController({
      getUserUseCase,
    })
  }
}

export default UserControllerComposer
