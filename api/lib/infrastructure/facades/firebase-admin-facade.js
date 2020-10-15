import * as firebaseAdmin from 'firebase-admin'

import * as dotenv from 'dotenv'
dotenv.config()

class FirebaseAdminFacade {
  initialize() {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(
        JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
      ),
      databaseURL: process.env.FIREBASE_DB_URL,
    })
  }

  async verifyToken(idToken) {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken)
    return decodedToken.uid
  }

  async send({ title, body, category, fcmToken }) {
    console.log(
      '[FIREBASE-ADMIN-FACADE] - sending message: ' +
        category +
        ' - ' +
        title +
        ' - ' +
        body
    )
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
