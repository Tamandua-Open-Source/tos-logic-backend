class DeleteTimerPreferencesUseCase {
  constructor({ timerPreferencesRepository }) {
    this.timerPreferencesRepository = timerPreferencesRepository
  }

  async execute(userId) {
    return await this.timerPreferencesRepository.deleteTimerPreferences(userId)
  }
}

export default DeleteTimerPreferencesUseCase
