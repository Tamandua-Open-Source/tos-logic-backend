import TimerController from '../timer-controller'
import UserRepository from '../../../infrastructure/repositories/user-repository'
import StateMachineFacade from '../../../infrastructure/facades/state-machine-facade'
import SchedulingFacade from '../../../infrastructure/facades/scheduling-facade'
import FirebaseAdminFacade from '../../../infrastructure/facades/firebase-admin-facade'

import {
  StartTimerUseCase,
  FinishTimerUseCase,
  WorkTimerUseCase,
  BreakTimerUseCase,
  PauseTimerUseCase,
  ResumeTimerUseCase,
  StatusTimerUseCase,
} from '../../../application/use-cases/timer'

class TimerControllerComposer {
  static compose() {
    const firebaseAdminFacade = new FirebaseAdminFacade()
    const userRepository = new UserRepository()
    const schedulingFacade = new SchedulingFacade({
      firebaseAdminFacade,
      stateMachineFacade: null,
    })
    const stateMachineFacade = new StateMachineFacade({
      userRepository,
      schedulingFacade,
    })
    schedulingFacade.assignStateMachineFacade({ stateMachineFacade })

    const startTimerUseCase = new StartTimerUseCase({ stateMachineFacade })
    const finishTimerUseCase = new FinishTimerUseCase({ stateMachineFacade })
    const workTimerUseCase = new WorkTimerUseCase({ stateMachineFacade })
    const breakTimerUseCase = new BreakTimerUseCase({ stateMachineFacade })
    const pauseTimerUseCase = new PauseTimerUseCase({ stateMachineFacade })
    const resumeTimerUseCase = new ResumeTimerUseCase({ stateMachineFacade })
    const statusTimerUseCase = new StatusTimerUseCase({ stateMachineFacade })

    return new TimerController({
      startTimerUseCase,
      finishTimerUseCase,
      workTimerUseCase,
      breakTimerUseCase,
      pauseTimerUseCase,
      resumeTimerUseCase,
      statusTimerUseCase,
    })
  }
}

export default TimerControllerComposer
