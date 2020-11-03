import HttpResponse from '../core/http-response'
import ServerError from '../core/server-error'
import ClientError from '../core/client-error'

class TimerController {
  constructor(useCases) {
    this.useCases = useCases
  }

  async startTimer(req) {
    const { userId } = req.props

    if (!userId) throw ServerError.internal()

    const { startTimerUseCase } = this.useCases
    const response = await startTimerUseCase.execute({
      userId,
    })

    if (response.success === true)
      return HttpResponse.created({
        message: 'State changed successfully',
        status: response.status,
        success: response.success,
      })

    return HttpResponse.accepted({
      message: 'The state cannot be changed',
      status: response.status,
      success: response.success,
    })
  }

  async finishTimer(req) {
    const { userId } = req.props

    if (!userId) throw ServerError.internal()

    const { finishTimerUseCase } = this.useCases
    const response = await finishTimerUseCase.execute({
      userId,
    })

    if (response.success === true)
      return HttpResponse.created({
        message: 'State changed successfully',
        status: response.status,
        success: response.success,
      })

    return HttpResponse.accepted({
      message: 'The state cannot be changed',
      status: response.status,
      success: response.success,
    })
  }

  async workTimer(req) {
    const { userId } = req.props

    if (!userId) throw ServerError.internal()

    const { workTimerUseCase } = this.useCases
    const response = await workTimerUseCase.execute({
      userId,
    })

    if (response.success === true)
      return HttpResponse.created({
        message: 'State changed successfully',
        status: response.status,
        success: response.success,
      })

    return HttpResponse.accepted({
      message: 'The state cannot be changed',
      status: response.status,
      success: response.success,
    })
  }

  async breakTimer(req) {
    const { userId } = req.props

    if (!userId) throw ServerError.internal()

    const { breakTimerUseCase } = this.useCases
    const response = await breakTimerUseCase.execute({
      userId,
    })

    if (response.success === true)
      return HttpResponse.created({
        message: 'State changed successfully',
        status: response.status,
        success: response.success,
      })

    return HttpResponse.accepted({
      message: 'The state cannot be changed',
      status: response.status,
      success: response.success,
    })
  }

  async pauseTimer(req) {
    const { userId } = req.props

    if (!userId) throw ServerError.internal()

    const { pauseTimerUseCase } = this.useCases
    const response = await pauseTimerUseCase.execute({
      userId,
    })

    if (response.success === true)
      return HttpResponse.created({
        message: 'State changed successfully',
        status: response.status,
        success: response.success,
      })

    return HttpResponse.accepted({
      message: 'The state cannot be changed',
      status: response.status,
      success: response.success,
    })
  }

  async resumeTimer(req) {
    const { userId } = req.props

    if (!userId) throw ServerError.internal()

    const { resumeTimerUseCase } = this.useCases
    const response = await resumeTimerUseCase.execute({
      userId,
    })

    if (response.success === true)
      return HttpResponse.created({
        message: 'State changed successfully',
        status: response.status,
        success: response.success,
      })

    return HttpResponse.accepted({
      message: 'The state cannot be changed',
      status: response.status,
      success: response.success,
    })
  }

  async statusTimer(req) {
    const { userId } = req.props

    if (!userId) throw ServerError.internal()

    const { statusTimerUseCase } = this.useCases
    const status = await statusTimerUseCase.execute({
      userId,
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
  }
}

export default TimerController
