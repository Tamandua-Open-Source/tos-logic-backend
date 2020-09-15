class SendWorkIdleMessageUseCase {
  constructor({ firebaseAdminFacade }) {
    this.firebaseAdminFacade = firebaseAdminFacade
  }

  async execute(fcmToken) {
    const title = 'WORK_IDLE'
    const body = '{USER_NAME}, você esqueceu de fazer uma pausa. ANDA LOGO'
    return await this.firebaseAdminFacade.send(title, body, fcmToken)
  }
}

export default SendWorkIdleMessageUseCase
