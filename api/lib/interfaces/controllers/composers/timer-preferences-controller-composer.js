import TimerPreferencesController from '../timer-preferences-controller'
import TimerPreferencesRepository from '../../../infrastructure/repositories/timer-preferences-repository'

import {
  CreateTimerPreferencesUseCase,
  GetTimerPreferencesUseCase,
  PatchTimerPreferencesUseCase,
  DeleteTimerPreferencesUseCase,
} from '../../../application/use-cases/timer-preferences'

class TimerPreferencesControllerComposer {
  static compose() {
    const timerPreferencesRepository = new TimerPreferencesRepository()

    const createTimerPreferencesUseCase = new CreateTimerPreferencesUseCase({
      timerPreferencesRepository,
    })

    const getTimerPreferencesUseCase = new GetTimerPreferencesUseCase({
      timerPreferencesRepository,
    })

    const patchTimerPreferencesUseCase = new PatchTimerPreferencesUseCase({
      timerPreferencesRepository,
    })

    const deleteTimerPreferencesUseCase = new DeleteTimerPreferencesUseCase({
      timerPreferencesRepository,
    })

    return new TimerPreferencesController({
      createTimerPreferencesUseCase,
      getTimerPreferencesUseCase,
      patchTimerPreferencesUseCase,
      deleteTimerPreferencesUseCase,
    })
  }
}

export default TimerPreferencesControllerComposer
