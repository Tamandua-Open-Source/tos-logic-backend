import ISchedulingFacade from '../../application/facade-interfaces/i-scheduling-facade'
import Queue from 'bull'
import * as dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

dotenv.config()

class SchedulingFacade extends ISchedulingFacade {
  constructor({ firebaseAdminFacade, stateMachineFacade }) {
    super()
    this.firebaseAdminFacade = firebaseAdminFacade
    this.stateMachineFacade = stateMachineFacade

    this.notificationQueue = new Queue('notification', {
      redis: process.env.REDIS_URL ?? undefined,
    })

    this.stateQueue = new Queue('state', {
      redis: process.env.REDIS_URL ?? undefined,
    })

    this.notificationQueue.process(async (job) => {
      console.log(
        '[SCHEDULING-FACADE](notificationQueue) - Processing Job - ' +
          'Id:' +
          job.id +
          ' | Title: ' +
          job.data.title +
          ' | Body: ' +
          job.data.body
      )

      return await this.firebaseAdminFacade.send({
        title: job.data.title,
        body: job.data.body,
        category: job.data.category,
        fcmToken: job.data.fcmToken,
      })
    })

    this.stateQueue.process(async (job) => {
      console.log(
        '[SCHEDULING-FACADE](stateQueue) - Processing Job - ' +
          'Id: ' +
          job.id +
          ' | State: ' +
          job.data.state
      )

      switch (job.data.state) {
        case this.stateMachineFacade.workIdleState:
          return this.stateMachineFacade.onWorkIdle({
            userId: job.data.userId,
          })
        case this.stateMachineFacade.breakIdleState:
          return this.stateMachineFacade.onBreakIdle({
            userId: job.data.userId,
          })
        case this.stateMachineFacade.pauseIdleState:
          return this.stateMachineFacade.onPauseIdle({
            userId: job.data.userId,
          })
        case this.stateMachineFacade.inactiveState:
          return this.stateMachineFacade.onInactive({
            userId: job.data.userId,
          })
        default:
          console.log('Erro')
      }
    })
  }

  assignStateMachineFacade({ stateMachineFacade }) {
    this.stateMachineFacade = stateMachineFacade
  }

  buildJobId(userId) {
    return userId + '-' + uuidv4()
  }

  async removeJobsOnNotificationQueue({ userId }) {
    const pattern = userId + '*'

    await this.notificationQueue.removeJobs(pattern).then(async function () {
      console.log(
        '[SCHEDULING-FACADE](notificationQueue) - Removing scheduled jobs for userId: ' +
          userId
      )
      return
    })
  }

  async removeJobsOnStateQueue({ userId }) {
    const pattern = userId + '*'

    await this.stateQueue.removeJobs(pattern).then(async function () {
      console.log(
        '[SCHEDULING-FACADE](stateQueue) - Removing scheduled jobs for userId: ' +
          userId
      )
      return
    })
  }

  scheduleNotification({ userId, title, body, category, fcmToken, delay }) {
    const data = {
      userId,
      title,
      body,
      fcmToken,
      category,
    }

    const options = {
      delay: delay,
      attempts: 2,
      jobId: this.buildJobId(userId),
    }

    this.notificationQueue.add(data, options)

    console.log(
      '[SCHEDULING-FACADE](notificationQueue) - job scheduled - ' +
        'Id: ' +
        options.jobId +
        ' | Title: ' +
        data.title +
        ' | Body: ' +
        data.body
    )
  }

  scheduleState({ userId, state, delay }) {
    const data = {
      userId,
      state,
    }

    const options = {
      delay: delay,
      attempts: 2,
      jobId: this.buildJobId(userId),
    }

    this.stateQueue.add(data, options)

    console.log(
      '[SCHEDULING-FACADE](stateQueue) - job scheduled -' +
        'Id: ' +
        options.jobId +
        ' | State: ' +
        data.state
    )
  }
}

export default SchedulingFacade
