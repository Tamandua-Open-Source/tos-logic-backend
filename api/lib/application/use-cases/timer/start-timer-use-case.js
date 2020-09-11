class StartTimerUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository
  }

  async execute(userId) {
    //DEBUG RESET
    await this.userRepository.patchUserPreferences(userId, {
      lastState: 'WORK',
      currentState: 'INATIVE',
    })

    const preferences = await this.userRepository.getUserPreferences(userId)
    if (!preferences) return null

    if (preferences.currentState !== 'INATIVE') return null

    //3

    //4

    const patchedPreferences = await this.userRepository.patchUserPreferences(
      userId,
      {
        lastWorkStartTime: new Date(),
        lastState: preferences.currentState,
        currentState: 'WORK',
      }
    )

    //7

    //8

    console.log(
      'lastState: ',
      reset.lastState,
      ' -> ',
      patchedPreferences.lastState,
      '\nCurrentState: ',
      reset.currentState,
      ' -> ',
      patchedPreferences.currentState
    )
    /**
     * consulta o estado atual do banco
     * 1 se for INATIVE
     * 2 na UserRepository: consulta as variáveis
     * 3 na QueueFacade: remove push notifications pelo userId
     * 4 na QueueFacade: remove internal actions pelo userId
     * 5 no UserRepository: atualiza a last_work_start_time
     * 6 no UserRepository: atualize last state e current state
     * 7 na QueueFacade: adiciona next_break
     * 8 na QueueFacade: adiciona move_to_work_idle
     **/

    return {
      from: patchedPreferences.lastState,
      to: patchedPreferences.currentState,
    }
  }
}

export default StartTimerUseCase
