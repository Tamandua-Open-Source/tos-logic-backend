import HttpResponse from '../core/http-response'

class TimerController {
  constructor(useCases) {
    this.useCases = useCases
  }

  async startTimer(req) {
    const { userId } = req.props

    if (!userId) {
      return HttpResponse.serverError()
    }

    try {
      const { startTimerUseCase } = this.useCases
      const state = await startTimerUseCase.execute(userId)

      if (state) {
        return HttpResponse.ok({ message: 'State changed successfully', state })
      } else {
        return HttpResponse.ok({ message: 'The state cannot be changed' })
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }

  async finishTimer(req) {
    const { userId } = req.props

    if (!userId) {
      return HttpResponse.serverError()
    }

    try {
      const { finishTimerUseCase } = this.useCases
      const state = await finishTimerUseCase.execute(userId)

      if (state) {
        return HttpResponse.ok({ message: 'State changed successfully', state })
      } else {
        return HttpResponse.serverError()
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }

  async workTimer(req) {
    const { userId } = req.props

    if (!userId) {
      return HttpResponse.serverError()
    }

    try {
      const { workTimerUseCase } = this.useCases
      const state = await workTimerUseCase.execute(userId)

      if (state) {
        return HttpResponse.ok({ message: 'State changed successfully', state })
      } else {
        return HttpResponse.serverError()
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }

  async breakTimer(req) {
    const { userId } = req.props

    if (!userId) {
      return HttpResponse.serverError()
    }

    try {
      const { breakTimerUseCase } = this.useCases
      const state = await breakTimerUseCase.execute(userId)

      if (state) {
        return HttpResponse.ok({ message: 'State changed successfully', state })
      } else {
        return HttpResponse.serverError()
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }

  async pauseTimer(req) {
    const { userId } = req.props

    if (!userId) {
      return HttpResponse.serverError()
    }

    try {
      const { pauseTimerUseCase } = this.useCases
      const state = await pauseTimerUseCase.execute(userId)

      if (state) {
        return HttpResponse.ok({ message: 'State changed successfully', state })
      } else {
        return HttpResponse.serverError()
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }

  async resumeTimer(req) {
    const { userId } = req.props

    if (!userId) {
      return HttpResponse.serverError()
    }

    try {
      const { resumeTimerUseCase } = this.useCases
      const state = await resumeTimerUseCase.execute(userId)

      if (state) {
        return HttpResponse.ok({ message: 'State changed successfully', state })
      } else {
        return HttpResponse.serverError()
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }
}

export default TimerController
