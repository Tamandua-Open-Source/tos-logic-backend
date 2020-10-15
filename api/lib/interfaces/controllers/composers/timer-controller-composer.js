import TimerController from '../timer-controller'
import TimerPreferencesRepository from '../../../infrastructure/repositories/timer-preferences-repository'
import StateMachineFacade from '../../../infrastructure/facades/state-machine-facade'
import SchedulingFacade from '../../../infrastructure/facades/scheduling-facade'
import FirebaseAdminFacade from '../../../infrastructure/facades/firebase-admin-facade'
import AnalyticsServiceFacade from '../../../infrastructure/facades/analytics-service-facade'
import PushMessageRepository from '../../../infrastructure/repositories/push-message-repository'

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
    const analyticsServiceFacade = new AnalyticsServiceFacade()
    const pushMessageRepository = new PushMessageRepository()
    const schedulingFacade = new SchedulingFacade({
      firebaseAdminFacade,
      stateMachineFacade: null,
    })
    const stateMachineFacade = new StateMachineFacade({
      timerPreferencesRepository,
      schedulingFacade,
      analyticsServiceFacade,
      pushMessageRepository,
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
