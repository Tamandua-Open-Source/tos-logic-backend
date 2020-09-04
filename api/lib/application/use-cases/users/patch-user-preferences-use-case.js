class PatchUserPreferenceUseCase {
  constructor({ userRepository }) {
    this.userRepository = userRepository
  }

  async execute(userId, updatedFields) {
    return await this.userRepository.patchUserPreferences(userId, updatedFields)
  }
}

export default PatchUserPreferenceUseCase
