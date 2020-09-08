class SendBreakIdleMessageUseCase {
  constructor({ firebaseAdminFacade }) {
    this.firebaseAdminFacade = firebaseAdminFacade
  }

  async execute(fcmToken) {
    const title = 'BREAK_IDLE'
    const body = '{USER_NAME}, você esqueceu de voltar a trabalhar. ANDA LOGO'
    return await this.firebaseAdminFacade.send(title, body, fcmToken)
  }
}

export default SendBreakIdleMessageUseCase
