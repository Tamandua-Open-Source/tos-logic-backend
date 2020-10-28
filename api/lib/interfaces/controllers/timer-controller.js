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
      const response = await startTimerUseCase.execute({
        userId,
        idToken,
      })

      if (response.success === true) {
        return HttpResponse.ok({
          message: 'State changed successfully',
          status: response.status,
          success: response.success,
        })
      } else {
        return HttpResponse.ok({
          message: 'The state cannot be changed',
          status: response.status,
          success: response.success,
        })
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
      const response = await finishTimerUseCase.execute({
        userId,
        idToken,
      })

      if (response.success === true) {
        return HttpResponse.ok({
          message: 'State changed successfully',
          status: response.status,
          success: response.success,
        })
      } else {
        return HttpResponse.ok({
          message: 'The state cannot be changed',
          status: response.status,
          success: response.success,
        })
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
      const response = await workTimerUseCase.execute({
        userId,
        idToken,
      })

      if (response.success === true) {
        return HttpResponse.ok({
          message: 'State changed successfully',
          status: response.status,
          success: response.success,
        })
      } else {
        return HttpResponse.ok({
          message: 'The state cannot be changed',
          status: response.status,
          success: response.success,
        })
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
      const response = await breakTimerUseCase.execute({
        userId,
        idToken,
      })

      if (response.success === true) {
        return HttpResponse.ok({
          message: 'State changed successfully',
          status: response.status,
          success: response.success,
        })
      } else {
        return HttpResponse.ok({
          message: 'The state cannot be changed',
          status: response.status,
          success: response.success,
        })
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
      const response = await pauseTimerUseCase.execute({
        userId,
        idToken,
      })

      if (response.success === true) {
        return HttpResponse.ok({
          message: 'State changed successfully',
          status: response.status,
          success: response.success,
        })
      } else {
        return HttpResponse.ok({
          message: 'The state cannot be changed',
          status: response.status,
          success: response.success,
        })
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
      const response = await resumeTimerUseCase.execute({
        userId,
        idToken,
      })

      if (response.success === true) {
        return HttpResponse.ok({
          message: 'State changed successfully',
          status: response.status,
          success: response.success,
        })
      } else {
        return HttpResponse.ok({
          message: 'The state cannot be changed',
          status: response.status,
          success: response.success,
        })
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
          success: true,
        })
      } else {
        return HttpResponse.ok({
          message: 'Timer status cannot be retrieved',
          success: false,
        })
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }
}

export default TimerController
