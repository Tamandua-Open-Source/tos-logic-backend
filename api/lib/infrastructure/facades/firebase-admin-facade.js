import * as firebaseAdmin from 'firebase-admin'

import * as dotenv from 'dotenv'
dotenv.config()

class FirebaseAdminFacade {
  initialize() {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(
        JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
      ),
      databaseURL: 'https://flexibe-macro.firebaseio.com',
    })
  }

  async verifyToken(idToken) {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken)
    return decodedToken.uid
  }

  async send(title, body, category, fcmToken) {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      apns: {
        payload: {
          aps: {
            category: category,
          },
        },
      },
      token: fcmToken,
    }

    return await firebaseAdmin.messaging().send(message)
  }
}

export default FirebaseAdminFacade
