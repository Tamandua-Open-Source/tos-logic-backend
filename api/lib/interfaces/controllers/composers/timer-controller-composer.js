import TimerController from '../timer-controller'
import UserRepository from '../../../infrastructure/repositories/user-repository'
import StateMachineFacade from '../../../infrastructure/facades/state-machine-facade'

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
    const userRepository = new UserRepository()
    const stateMachineFacade = new StateMachineFacade()

    const startTimerUseCase = new StartTimerUseCase({
      userRepository,
      stateMachineFacade,
    })
    const finishTimerUseCase = new FinishTimerUseCase({
      userRepository,
      stateMachineFacade,
    })
    const workTimerUseCase = new WorkTimerUseCase({
      userRepository,
      stateMachineFacade,
    })
    const breakTimerUseCase = new BreakTimerUseCase({
      userRepository,
      stateMachineFacade,
    })
    const pauseTimerUseCase = new PauseTimerUseCase({
      userRepository,
      stateMachineFacade,
    })
    const resumeTimerUseCase = new ResumeTimerUseCase({
      userRepository,
      stateMachineFacade,
    })

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
