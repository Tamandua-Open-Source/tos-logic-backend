class SendPauseIdleMessageUseCase {
  constructor({ firebaseAdminFacade }) {
    this.firebaseAdminFacade = firebaseAdminFacade
  }

  async execute(fcmToken) {
    const title = 'PAUSE_IDLE'
    const body = '{USER_NAME}, você esqueceu o timer pausado. VOLTA'
    return await this.firebaseAdminFacade.send(title, body, fcmToken)
  }
}

export default SendPauseIdleMessageUseCase
