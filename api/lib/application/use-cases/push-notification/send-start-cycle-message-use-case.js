class SendStartCycleMessageUseCase {
  constructor({ firebaseAdminFacade }) {
    this.firebaseAdminFacade = firebaseAdminFacade
  }

  async execute(fcmToken) {
    const title = 'START_CYCLE'
    const body = '{USER_NAME}, é hora de começar a trabalhar'
    return await this.firebaseAdminFacade.send(title, body, fcmToken)
  }
}

export default SendStartCycleMessageUseCase
