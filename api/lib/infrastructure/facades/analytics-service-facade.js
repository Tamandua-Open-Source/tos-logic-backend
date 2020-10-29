import axios from 'axios'

import * as dotenv from 'dotenv'
dotenv.config()

class AnalyticsServiceFacade {
  constructor() {
    this.base_url = process.env.ANALYTICS_URL
  }

  async logBreakIdle({ idToken }) {
    try {
      await axios.post(
        `${this.base_url}/api/analytics/actions/breakIdle`,
        {},
        {
          headers: {
            Authorization: idToken,
          },
        }
      )
    } catch (error) {
      console.log('[ANALYTICS-SERVICE-FACADE] - service unavailable: ', error)
    }
  }

  async logBreak({ idToken }) {
    try {
      await axios.post(
        `${this.base_url}/api/analytics/actions/break`,
        {},
        {
          headers: {
            Authorization: idToken,
          },
        }
      )
    } catch (error) {
      console.log('[ANALYTICS-SERVICE-FACADE] - service unavailable: ', error)
    }
  }

  async logFinish({ idToken }) {
    try {
      await axios.post(
        `${this.base_url}/api/analytics/actions/finish`,
        {},
        {
          headers: {
            Authorization: idToken,
          },
        }
      )
    } catch (error) {
      console.log('[ANALYTICS-SERVICE-FACADE] - service unavailable: ', error)
    }
  }

  async logInactive({ idToken }) {
    try {
      await axios.post(
        `${this.base_url}/api/analytics/actions/inactive`,
        {},
        {
          headers: {
            Authorization: idToken,
          },
        }
      )
    } catch (error) {
      console.log('[ANALYTICS-SERVICE-FACADE] - service unavailable: ', error)
    }
  }

  async logPauseIdle({ idToken }) {
    try {
      await axios.post(
        `${this.base_url}/api/analytics/actions/pauseIdle`,
        {},
        {
          headers: {
            Authorization: idToken,
          },
        }
      )
    } catch (error) {
      console.log('[ANALYTICS-SERVICE-FACADE] - service unavailable: ', error)
    }
  }

  async logPause({ idToken }) {
    try {
      await axios.post(
        `${this.base_url}/api/analytics/actions/pause`,
        {},
        {
          headers: {
            Authorization: idToken,
          },
        }
      )
    } catch (error) {
      console.log('[ANALYTICS-SERVICE-FACADE] - service unavailable: ', error)
    }
  }

  async logResume({ idToken }) {
    try {
      await axios.post(
        `${this.base_url}/api/analytics/actions/resume`,
        {},
        {
          headers: {
            Authorization: idToken,
          },
        }
      )
    } catch (error) {
      console.log('[ANALYTICS-SERVICE-FACADE] - service unavailable: ', error)
    }
  }

  async logStartCycle({ idToken }) {
    try {
      await axios.post(
        `${this.base_url}/api/analytics/actions/startCycle`,
        {},
        {
          headers: {
            Authorization: idToken,
          },
        }
      )
    } catch (error) {
      console.log('[ANALYTICS-SERVICE-FACADE] - service unavailable: ', error)
    }
  }

  async logWorkIdle({ idToken }) {
    try {
      await axios.post(
        `${this.base_url}/api/analytics/actions/workIdle`,
        {},
        {
          headers: {
            Authorization: idToken,
          },
        }
      )
    } catch (error) {
      console.log('[ANALYTICS-SERVICE-FACADE] - service unavailable: ', error)
    }
  }

  async logWork({ idToken }) {
    try {
      await axios.post(
        `${this.base_url}/api/analytics/actions/work`,
        {},
        {
          headers: {
            Authorization: idToken,
          },
        }
      )
    } catch (error) {
      console.log('[ANALYTICS-SERVICE-FACADE] - service unavailable: ', error)
    }
  }
}

export default AnalyticsServiceFacade
