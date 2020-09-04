import HttpResponse from '../core/http-response'

class UserController {
  constructor(useCases) {
    this.useCases = useCases
  }

  async getUser(req) {
    const { userId } = req.props

    if (!userId) {
      return HttpResponse.serverError()
    }

    try {
      const { getUserUseCase } = this.useCases
      const user = await getUserUseCase.execute(userId)

      if (!user) {
        return HttpResponse.ok({ message: 'Cannot find user' })
      } else {
        return HttpResponse.ok({ message: 'User retrieved', user })
      }
    } catch (error) {
      console.error(error)
      return HttpResponse.serverError()
    }
  }
}

export default UserController
