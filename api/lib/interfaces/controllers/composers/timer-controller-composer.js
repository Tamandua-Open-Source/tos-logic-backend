import TimerController from '../timer-controller'

import {
  StartTimerUseCase,
  FinishTimerUseCase,
  WorkTimerUseCase,
  BreakTimerUseCase,
  PauseTimerUseCase,
  ResumeTimerUseCase,
} from '../../../application/use-cases/timer'

//injetar:
//queue facade
//firebase admin facade
//internal action facade
class TimerControllerComposer {
  static compose() {
    const startTimerUseCase = new StartTimerUseCase()
    const finishTimerUseCase = new FinishTimerUseCase()
    const workTimerUseCase = new WorkTimerUseCase()
    const breakTimerUseCase = new BreakTimerUseCase()
    const pauseTimerUseCase = new PauseTimerUseCase()
    const resumeTimerUseCase = new ResumeTimerUseCase()

    return new TimerController({
      startTimerUseCase,
      finishTimerUseCase,
      workTimerUseCase,
      breakTimerUseCase,
      pauseTimerUseCase,
      resumeTimerUseCase,
    })
  }
}

export default TimerControllerComposer
