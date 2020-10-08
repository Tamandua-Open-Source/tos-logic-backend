import axios from 'axios'

import * as dotenv from 'dotenv'
dotenv.config()

class AnalyticsServiceFacade {
  constructor() {
    this.base_url = process.env.ANALYTICS_URL
  }

  async logBreakIdle({ idToken }) {
    await axios.post(
      `${this.base_url}/api/analytics/actions/breakIdle`,
      {},
      {
        headers: {
          Authorization: idToken,
        },
      }
    )
  }

  async logBreak({ idToken }) {
    await axios.post(
      `${this.base_url}/api/analytics/actions/break`,
      {},
      {
        headers: {
          Authorization: idToken,
        },
      }
    )
  }

  async logFinish({ idToken }) {
    await axios.post(
      `${this.base_url}/api/analytics/actions/finish`,
      {},
      {
        headers: {
          Authorization: idToken,
        },
      }
    )
  }

  async logInactive({ idToken }) {
    await axios.post(
      `${this.base_url}/api/analytics/actions/inactive`,
      {},
      {
        headers: {
          Authorization: idToken,
        },
      }
    )
  }

  async logPauseIdle({ idToken }) {
    await axios.post(
      `${this.base_url}/api/analytics/actions/pauseIdle`,
      {},
      {
        headers: {
          Authorization: idToken,
        },
      }
    )
  }

  async logPause({ idToken }) {
    await axios.post(
      `${this.base_url}/api/analytics/actions/pause`,
      {},
      {
        headers: {
          Authorization: idToken,
        },
      }
    )
  }

  async logResume({ idToken }) {
    await axios.post(
      `${this.base_url}/api/analytics/actions/resume`,
      {},
      {
        headers: {
          Authorization: idToken,
        },
      }
    )
  }

  async logStartCycle({ idToken }) {
    await axios.post(
      `${this.base_url}/api/analytics/actions/startCycle`,
      {},
      {
        headers: {
          Authorization: idToken,
        },
      }
    )
  }

  async logWorkIdle({ idToken }) {
    await axios.post(
      `${this.base_url}/api/analytics/actions/workIdle`,
      {},
      {
        headers: {
          Authorization: idToken,
        },
      }
    )
  }

  async logWork({ idToken }) {
    await axios.post(
      `${this.base_url}/api/analytics/actions/work`,
      {},
      {
        headers: {
          Authorization: idToken,
        },
      }
    )
  }
}

export default AnalyticsServiceFacade
