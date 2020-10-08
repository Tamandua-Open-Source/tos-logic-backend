class GetTimerPreferencesUseCase {
  constructor({ timerPreferencesRepository }) {
    this.timerPreferencesRepository = timerPreferencesRepository
  }

  async execute(userId) {
    return await this.timerPreferencesRepository.getTimerPreferences(userId)
  }
}

export default GetTimerPreferencesUseCase
