class SendNextBreakMessageUseCase {
  constructor({ firebaseAdminFacade }) {
    this.firebaseAdminFacade = firebaseAdminFacade
  }

  async execute(fcmToken) {
    const title = 'NEXT_BREAK'
    const body = '{USER_NAME}, é hora de fazer uma pausa'
    return await this.firebaseAdminFacade.send(title, body, fcmToken)
  }
}

export default SendNextBreakMessageUseCase
