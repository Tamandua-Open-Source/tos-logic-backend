class SendNextWorkMessageUseCase {
  constructor({ firebaseAdminFacade }) {
    this.firebaseAdminFacade = firebaseAdminFacade
  }

  async execute(fcmToken) {
    const title = 'NEXT_WORK'
    const body = '{USER_NAME}, é hora de voltar a trabalhar'
    return await this.firebaseAdminFacade.send(title, body, fcmToken)
  }
}

export default SendNextWorkMessageUseCase
