class PatchTimerPreferencesUseCase {
  constructor({ timerPreferencesRepository }) {
    this.timerPreferencesRepository = timerPreferencesRepository
  }

  async execute(userId, updatedFields) {
    return await this.timerPreferencesRepository.patchTimerPreferences(
      userId,
      updatedFields
    )
  }
}

export default PatchTimerPreferencesUseCase
