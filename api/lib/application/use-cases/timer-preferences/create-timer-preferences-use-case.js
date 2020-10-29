class CreateTimerPreferencesUseCase {
  constructor({ timerPreferencesRepository }) {
    this.timerPreferencesRepository = timerPreferencesRepository
  }

  async execute(userId) {
    const preferences = await this.timerPreferencesRepository.getTimerPreferences(
      userId
    )

    if (preferences) {
      return null
    }

    return await this.timerPreferencesRepository.createTimerPreferences(userId)
  }
}

export default CreateTimerPreferencesUseCase
