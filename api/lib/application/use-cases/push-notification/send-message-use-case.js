class SendMessageUseCase {
  constructor({ firebaseAdminFacade }) {
    this.firebaseAdminFacade = firebaseAdminFacade
  }

  async execute(title, body, fcmToken) {
    return await this.firebaseAdminFacade.send(title, body, fcmToken)
  }
}

export default SendMessageUseCase
