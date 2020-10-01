class CreateTimerPreferencesUseCase {
  constructor({ timerPreferencesRepository }) {
    this.timerPreferencesRepository = timerPreferencesRepository
  }

  async execute(userId) {
    return await this.timerPreferencesRepository.createTimerPreferences(userId)
  }
}

export default CreateTimerPreferencesUseCase
