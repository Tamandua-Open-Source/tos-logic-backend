import axios from 'axios'

import * as dotenv from 'dotenv'
dotenv.config()

class UserDataFacade {
  constructor() {
    this.base_url = process.env.API_URL
  }

  async getUserData({ idToken }) {
    try {
      const response = await axios.get(
        `${this.base_url}/api/users/me/preferences`,
        {
          headers: {
            Authorization: idToken,
          },
        }
      )
      return {
        fcmToken: response.data.preferences.fcmToken,
      }
    } catch (error) {
      console.log('[USER-DATA-FACADE] - service unavailable', error)

      return {
        fcmToken: null,
      }
    }
  }
}

export default UserDataFacade
