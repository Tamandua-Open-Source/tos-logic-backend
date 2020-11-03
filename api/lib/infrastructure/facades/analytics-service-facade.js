import axios from 'axios'

import * as dotenv from 'dotenv'
dotenv.config()

class AnalyticsServiceFacade {
  constructor() {
    this.base_url = process.env.ANALYTICS_URL
    this.api_key = process.env.ANALYTICS_API_KEY
  }

  async addUserTimerAction({ userId, timerActionId }) {
    try {
      await axios.post(
        `${this.base_url}/api/users/${userId}/timerActions/${timerActionId}`,
        {},
        {
          headers: {
            Authorization: this.api_key,
          },
        }
      )
    } catch (error) {
      console.log('[ANALYTICS-SERVICE-FACADE] - service unavailable: ', error)
    }
  }

  async logBreakIdle({ userId }) {
    await this.addUserTimerAction({
      userId,
      timerActionId: 9,
    })
  }

  async logBreak({ userId }) {
    await this.addUserTimerAction({
      userId,
      timerActionId: 2,
    })
  }

  async logFinish({ userId }) {
    await this.addUserTimerAction({
      userId,
      timerActionId: 6,
    })
  }

  async logInactive({ userId }) {
    await this.addUserTimerAction({
      userId,
      timerActionId: 11,
    })
  }

  async logPauseIdle({ userId }) {
    await this.addUserTimerAction({
      userId,
      timerActionId: 10,
    })
  }

  async logPause({ userId }) {
    await this.addUserTimerAction({
      userId,
      timerActionId: 4,
    })
  }

  async logResume({ userId }) {
    await this.addUserTimerAction({
      userId,
      timerActionId: 5,
    })
  }

  async logStartCycle({ userId }) {
    await this.addUserTimerAction({
      userId,
      timerActionId: 7,
    })
  }

  async logWorkIdle({ userId }) {
    await this.addUserTimerAction({
      userId,
      timerActionId: 8,
    })
  }

  async logWork({ userId }) {
    await this.addUserTimerAction({
      userId,
      timerActionId: 3,
    })
  }
}

export default AnalyticsServiceFacade
