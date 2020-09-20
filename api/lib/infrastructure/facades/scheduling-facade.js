import ISchedulingFacade from '../../application/facade-interfaces/i-scheduling-facade'
import Queue from 'bull'
import * as dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

dotenv.config()

class SchedulingFacade extends ISchedulingFacade {
  constructor({ firebaseAdminFacade, idleSystemFacade }) {
    super()
    this.firebaseAdminFacade = firebaseAdminFacade
    this.idleSystemFacade = idleSystemFacade

    this.notificationQueue = new Queue('notification', {
      redis: process.env.REDIS_URL ?? undefined,
    })

    this.idleSystemQueue = new Queue('idleSystem', {
      redis: process.env.REDIS_URL ?? undefined,
    })

    this.notificationQueue.process(async (job) => {
      console.log(
        '[SCHEDULING_FACADE](notificationQueue) - Processing job: ' + job.id
      )

      return await this.firebaseAdminFacade.send(
        job.data.title,
        job.data.body,
        job.data.category,
        job.data.fcmToken
      )
    })

    this.idleSystemQueue.process(async (job) => {
      console.log(
        '[SCHEDULING_FACADE](idleSystemQueue) - Processing job: ' + job.id
      )

      return await this.idleSystemFacade.moveToIdleState({
        idleState: job.data.idleState,
        userId: job.data.userId,
      })
    })
  }

  getUniqueId(userId) {
    return userId + '-' + uuidv4()
  }

  removeAllScheduledPushNotifications({ userId }) {
    const pattern = userId + '*'
    this.notificationQueue.removeJobs(pattern).then(function () {
      console.log(
        '[SCHEDULING_FACADE](notificationQueue) - Removing scheduled jobs for userId: ' +
          userId
      )
    })
  }

  removeAllScheduledIdleSystemActions({ userId }) {
    const pattern = userId + '*'
    this.idleSystemQueue.removeJobs(pattern).then(function () {
      console.log(
        '[SCHEDULING_FACADE](idleSystemQueue) - Removing scheduled jobs for userId: ' +
          userId
      )
    })
  }

  scheduleStartCycleNotification({ userId, fcmToken, delay }) {
    const jobId = this.getUniqueId(userId)

    const data = {
      userId: userId,
      title: '🥰 Bom dia flor do dia',
      body: 'Vamos começar o seu ciclo de trabalho de hoje? ❤️',
      fcmToken: fcmToken,
      category: 'UN_START_CATEGORY',
    }

    const options = {
      delay: delay,
      attempts: 2,
      jobId: jobId,
    }

    this.notificationQueue.add(data, options)

    console.log(
      '[SCHEDULING_FACADE](notificationQueue) - (START_CYCLE) - scheduling job: ' +
        jobId
    )
  }

  scheduleNextBreakNotification({ userId, fcmToken, delay }) {
    const jobId = this.getUniqueId(userId)

    const data = {
      userId: userId,
      title: '🚨 Policia da ergonomia',
      body: 'Você está sendo conduzido a tirar um break. 💔',
      fcmToken: fcmToken,
      category: 'UN_BREAK_START_CATEGORY',
    }

    const options = {
      delay: delay,
      attempts: 2,
      jobId: jobId,
    }

    this.notificationQueue.add(data, options)

    console.log(
      '[SCHEDULING_FACADE](notificationQueue) - (NEXT_BREAK) - scheduling job: ' +
        jobId
    )
  }

  scheduleNextWorkNotification({ userId, fcmToken, delay }) {
    const jobId = this.getUniqueId(userId)

    const data = {
      userId: userId,
      title: '💼 Seu advogado conseguiu!',
      body: 'Habeas corpus liberado, pode voltar a trabalhar. 🤎',
      fcmToken: fcmToken,
      category: 'UN_BREAK_END_CATEGORY',
    }

    const options = {
      delay: delay,
      attempts: 2,
      jobId: jobId,
    }

    this.notificationQueue.add(data, options)

    console.log(
      '[SCHEDULING_FACADE](notificationQueue) - (NEXT_WORK) - scheduling job: ' +
        jobId
    )
  }

  scheduleWorkIdleNotification({ userId, fcmToken, delay }) {
    const jobId = this.getUniqueId(userId)

    const data = {
      userId: userId,
      title: '⚠️⚠️⚠️',
      body: 'Você esqueceu de tirar um descanso!!! 🧡',
      fcmToken: fcmToken,
      category: 'UN_BREAK_START_CATEGORY',
    }

    const options = {
      delay: delay,
      attempts: 2,
      jobId: jobId,
    }

    this.notificationQueue.add(data, options)

    console.log(
      '[SCHEDULING_FACADE](notificationQueue) - (WORK_IDLE) - scheduling job: ' +
        jobId
    )
  }

  scheduleBreakIdleNotification({ userId, fcmToken, delay }) {
    const jobId = this.getUniqueId(userId)

    const data = {
      userId: userId,
      title: '⚠️⚠️⚠️',
      body: 'Você esqueceu de voltar a trabalhar!!! 💜',
      fcmToken: fcmToken,
      category: 'UN_BREAK_END_CATEGORY',
    }

    const options = {
      delay: delay,
      attempts: 2,
      jobId: jobId,
    }

    this.notificationQueue.add(data, options)

    console.log(
      '[SCHEDULING_FACADE](notificationQueue) - (BREAK_IDLE) - scheduling job: ' +
        jobId
    )
  }

  schedulePauseIdleNotification({ userId, fcmToken, delay }) {
    const jobId = this.getUniqueId(userId)

    const data = {
      userId: userId,
      title: '⚠️⚠️⚠️',
      body: 'Você esqueceu o timer pausado!!! 💚',
      fcmToken: fcmToken,
      category: 'UN_DEFAULT_CATEGORY',
    }

    const options = {
      delay: delay,
      attempts: 2,
      jobId: jobId,
    }

    this.notificationQueue.add(data, options)

    console.log(
      '[SCHEDULING_FACADE](notificationQueue) - (PAUSE_IDLE) - scheduling job: ' +
        jobId
    )
  }

  scheduleInactiveNotification({ userId, fcmToken, delay }) {
    const jobId = this.getUniqueId(userId)

    const data = {
      userId: userId,
      title: '🚫🚫🚫',
      body: 'Você me esqueceu mesmo né. Até amanhã então...',
      fcmToken: fcmToken,
      category: 'UN_DEFAULT_CATEGORY',
    }

    const options = {
      delay: delay,
      attempts: 2,
      jobId: jobId,
    }

    this.notificationQueue.add(data, options)

    console.log(
      '[SCHEDULING_FACADE](notificationQueue) - (INACTIVE) - scheduling job: ' +
        jobId
    )
  }

  scheduleWorkIdleAction({
    userId,
    fcmToken,
    delay,
    delayToInactive,
    delayStartCycle,
  }) {
    const jobId = this.getUniqueId(userId)

    this.scheduleWorkIdleNotification({ userId, fcmToken, delay })
    this.scheduleInactiveAction({
      userId,
      fcmToken,
      delay: delayToInactive,
      delayStartCycle,
    })

    const data = {
      userId: userId,
      idleState: this.idleSystemFacade.workIdleState,
    }

    const options = {
      delay: delay,
      attempts: 2,
      jobId: jobId,
    }

    this.idleSystemQueue.add(data, options)

    console.log(
      '[SCHEDULING_FACADE](idleSystemQueue) - (WORK_IDLE) - scheduling job: ' +
        jobId
    )
  }

  scheduleBreakIdleAction({
    userId,
    fcmToken,
    delay,
    delayToInactive,
    delayStartCycle,
  }) {
    const jobId = this.getUniqueId(userId)

    this.scheduleBreakIdleNotification({ userId, fcmToken, delay })
    this.scheduleInactiveAction({
      userId,
      fcmToken,
      delay: delayToInactive,
      delayStartCycle,
    })

    const data = {
      userId: userId,
      idleState: this.idleSystemFacade.breakIdleState,
    }

    const options = {
      delay: delay,
      attempts: 2,
      jobId: jobId,
    }

    this.idleSystemQueue.add(data, options)

    console.log(
      '[SCHEDULING_FACADE](idleSystemQueue) - (BREAK_IDLE) - scheduling job: ' +
        jobId
    )
  }

  schedulePauseIdleAction({
    userId,
    fcmToken,
    delay,
    delayToInactive,
    delayStartCycle,
  }) {
    const jobId = this.getUniqueId(userId)

    this.schedulePauseIdleNotification({ userId, fcmToken, delay })
    this.scheduleInactiveAction({
      userId,
      fcmToken,
      delay: delayToInactive,
      delayStartCycle,
    })

    const data = {
      userId: userId,
      idleState: this.idleSystemFacade.pauseIdleState,
    }

    const options = {
      delay: delay,
      attempts: 2,
      jobId: jobId,
    }

    this.idleSystemQueue.add(data, options)

    console.log(
      '[SCHEDULING_FACADE](idleSystemQueue) - (PAUSE_IDLE) - scheduling job: ' +
        jobId
    )
  }

  scheduleInactiveAction({ userId, fcmToken, delay, delayStartCycle }) {
    const jobId = this.getUniqueId(userId)

    this.scheduleInactiveNotification({ userId, fcmToken, delay })
    this.scheduleStartCycleNotification({
      userId,
      fcmToken,
      delay: delayStartCycle,
    })

    const data = {
      userId: userId,
      idleState: this.idleSystemFacade.inactiveState,
    }

    const options = {
      delay: delay,
      attempts: 2,
      jobId: jobId,
    }

    this.idleSystemQueue.add(data, options)

    console.log(
      '[SCHEDULING_FACADE](idleSystemQueue) - (INACTIVE) - scheduling job: ' +
        jobId
    )
  }
}

export default SchedulingFacade
