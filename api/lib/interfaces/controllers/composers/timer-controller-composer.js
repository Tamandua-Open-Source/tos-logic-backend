import TimerController from '../timer-controller'
import UserRepository from '../../../infrastructure/repositories/user-repository'
import StateMachineFacade from '../../../infrastructure/facades/state-machine-facade'
import IdleSystemFacade from '../../../infrastructure/facades/idle-system-facade'
import SchedulingFacade from '../../../infrastructure/facades/scheduling-facade'
import FirebaseAdminFacade from '../../../infrastructure/firebase/firebase-admin-facade'

import {
  StartTimerUseCase,
  FinishTimerUseCase,
  WorkTimerUseCase,
  BreakTimerUseCase,
  PauseTimerUseCase,
  ResumeTimerUseCase,
} from '../../../application/use-cases/timer'

class TimerControllerComposer {
  static compose() {
    const firebaseAdminFacade = new FirebaseAdminFacade()
    const userRepository = new UserRepository()
    const stateMachineFacade = new StateMachineFacade()
    const idleSystemFacade = new IdleSystemFacade({
      userRepository,
    })
    const schedulingFacade = new SchedulingFacade({
      firebaseAdminFacade,
      idleSystemFacade,
    })

    const startTimerUseCase = new StartTimerUseCase({
      userRepository,
      stateMachineFacade,
      schedulingFacade,
    })
    const finishTimerUseCase = new FinishTimerUseCase({
      userRepository,
      stateMachineFacade,
      schedulingFacade,
    })
    const workTimerUseCase = new WorkTimerUseCase({
      userRepository,
      stateMachineFacade,
      schedulingFacade,
    })
    const breakTimerUseCase = new BreakTimerUseCase({
      userRepository,
      stateMachineFacade,
      schedulingFacade,
    })
    const pauseTimerUseCase = new PauseTimerUseCase({
      userRepository,
      stateMachineFacade,
      schedulingFacade,
    })
    const resumeTimerUseCase = new ResumeTimerUseCase({
      userRepository,
      stateMachineFacade,
      schedulingFacade,
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
