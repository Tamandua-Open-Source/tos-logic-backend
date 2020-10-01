import TimerController from '../timer-controller'
import TimerPreferencesRepository from '../../../infrastructure/repositories/timer-preferences-repository'
import StateMachineFacade from '../../../infrastructure/facades/state-machine-facade'
import SchedulingFacade from '../../../infrastructure/facades/scheduling-facade'
import UserDataFacade from '../../../infrastructure/facades/user-data-facade'
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
    const timerPreferencesRepository = new TimerPreferencesRepository()
    const userDataFacade = new UserDataFacade()
    const schedulingFacade = new SchedulingFacade({
      firebaseAdminFacade,
      stateMachineFacade: null,
    })
    const stateMachineFacade = new StateMachineFacade({
      timerPreferencesRepository,
      schedulingFacade,
      userDataFacade,
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
