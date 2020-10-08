import HttpResponse from '../core/http-response'

class TimerController {
  constructor(useCases) {
    this.useCases = useCases
  }

  async startTimer(req) {
    const { userId, idToken } = req.props

    if (!userId) {
      return HttpResponse.serverError()
    }

    try {
      const { startTimerUseCase } = this.useCases
      const status = await startTimerUseCase.execute({
        userId,
        idToken,
      })

      if (status) {
        return HttpResponse.ok({
          message: 'State changed successfully',
          status,
        })
      } else {
        return HttpResponse.ok({ message: 'The state cannot be changed' })
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }

  async finishTimer(req) {
    const { userId, idToken } = req.props

    if (!userId) {
      return HttpResponse.serverError()
    }

    try {
      const { finishTimerUseCase } = this.useCases
      const status = await finishTimerUseCase.execute({
        userId,
        idToken,
      })

      if (status) {
        return HttpResponse.ok({
          message: 'State changed successfully',
          status,
        })
      } else {
        return HttpResponse.ok({ message: 'The state cannot be changed' })
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }

  async workTimer(req) {
    const { userId, idToken } = req.props

    if (!userId) {
      return HttpResponse.serverError()
    }

    try {
      const { workTimerUseCase } = this.useCases
      const status = await workTimerUseCase.execute({
        userId,
        idToken,
      })

      if (status) {
        return HttpResponse.ok({
          message: 'State changed successfully',
          status,
        })
      } else {
        return HttpResponse.ok({ message: 'The state cannot be changed' })
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }

  async breakTimer(req) {
    const { userId, idToken } = req.props

    if (!userId) {
      return HttpResponse.serverError()
    }

    try {
      const { breakTimerUseCase } = this.useCases
      const status = await breakTimerUseCase.execute({
        userId,
        idToken,
      })

      if (status) {
        return HttpResponse.ok({
          message: 'State changed successfully',
          status,
        })
      } else {
        return HttpResponse.ok({ message: 'The state cannot be changed' })
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }

  async pauseTimer(req) {
    const { userId, idToken } = req.props

    if (!userId) {
      return HttpResponse.serverError()
    }

    try {
      const { pauseTimerUseCase } = this.useCases
      const status = await pauseTimerUseCase.execute({
        userId,
        idToken,
      })

      if (status) {
        return HttpResponse.ok({
          message: 'State changed successfully',
          status,
        })
      } else {
        return HttpResponse.ok({ message: 'The state cannot be changed' })
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }

  async resumeTimer(req) {
    const { userId, idToken } = req.props

    if (!userId) {
      return HttpResponse.serverError()
    }

    try {
      const { resumeTimerUseCase } = this.useCases
      const status = await resumeTimerUseCase.execute({
        userId,
        idToken,
      })

      if (status) {
        return HttpResponse.ok({
          message: 'State changed successfully',
          status,
        })
      } else {
        return HttpResponse.ok({ message: 'The state cannot be changed' })
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }

  async statusTimer(req) {
    const { userId, idToken } = req.props

    if (!userId) {
      return HttpResponse.serverError()
    }

    try {
      const { statusTimerUseCase } = this.useCases
      const status = await statusTimerUseCase.execute({
        userId,
        idToken,
      })

      if (status) {
        return HttpResponse.ok({
          message: 'Timer status retrieved successfully',
          status,
        })
      } else {
        return HttpResponse.ok({
          message: 'Timer status cannot be retrieved',
        })
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }
}

export default TimerController
