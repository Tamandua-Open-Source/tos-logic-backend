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
        '[BULL - notificationQueue] executing job ' +
          job.id +
          ' -> ' +
          job.data.title
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
        '[BULL - idleSystemQueue] executing job ' +
          job.id +
          ' -> ' +
          job.data.description
      )
      return
    })
  }

  getUniqueId(userId) {
    return userId + '-' + uuidv4()
  }

  removeAllScheduledPushNotifications(userId) {
    const pattern = userId + '*'
    this.notificationQueue.removeJobs(pattern).then(function () {
      console.log('[BULL - notificationQueue] removing jobs for ' + userId)
    })
  }

  removeAllScheduledIdleSystemActions(userId) {
    const pattern = userId + '*'
    this.idleSystemQueue.removeJobs(pattern).then(function () {
      console.log('[BULL - idleSystemQueue] removing jobs for ' + userId)
    })
  }

  scheduleStartCycleNotification(userId, fcmToken) {
    const data = {
      userId: userId,
      title: '🥰 Bom dia flor do dia',
      body: 'Vamos começar o seu ciclo de trabalho de hoje? ❤️',
      fcmToken: fcmToken,
      category: 'UN_START_CATEGORY',
    }

    const options = {
      delay: 5000,
      attempts: 2,
      jobId: this.getUniqueId(userId),
    }

    this.notificationQueue.add(data, options)
  }

  scheduleNextBreakNotification(userId, fcmToken) {
    const data = {
      userId: userId,
      title: '🚨 Policia da ergonomia',
      body: 'Você está sendo conduzido a tirar um break. 💔',
      fcmToken: fcmToken,
      category: 'UN_BREAK_START_CATEGORY',
    }

    const options = {
      delay: 5000,
      attempts: 2,
      jobId: this.getUniqueId(userId),
    }

    this.notificationQueue.add(data, options)
  }

  scheduleNextWorkNotification(userId, fcmToken) {
    const data = {
      userId: userId,
      title: '💼 Seu advogado conseguiu!',
      body: 'Habeas corpus liberado, pode voltar a trabalhar. 🤎',
      fcmToken: fcmToken,
      category: 'UN_BREAK_END_CATEGORY',
    }

    const options = {
      delay: 5000,
      attempts: 2,
      jobId: this.getUniqueId(userId),
    }

    this.notificationQueue.add(data, options)
  }

  scheduleWorkIdleNotification(userId, fcmToken) {
    const data = {
      userId: userId,
      title: '⚠️⚠️⚠️',
      body: 'Você esqueceu de tirar um descanso!!! 🧡',
      fcmToken: fcmToken,
      category: 'UN_BREAK_START_CATEGORY',
    }

    const options = {
      delay: 15000,
      attempts: 2,
      jobId: this.getUniqueId(userId),
    }

    this.notificationQueue.add(data, options)
  }

  scheduleBreakIdleNotification(userId, fcmToken) {
    const data = {
      userId: userId,
      title: '⚠️⚠️⚠️',
      body: 'Você esqueceu de voltar a trabalhar!!! 💜',
      fcmToken: fcmToken,
      category: 'UN_BREAK_END_CATEGORY',
    }

    const options = {
      delay: 15000,
      attempts: 2,
      jobId: this.getUniqueId(userId),
    }

    this.notificationQueue.add(data, options)
  }

  schedulePauseIdleNotification(userId, fcmToken) {
    const data = {
      userId: userId,
      title: '⚠️⚠️⚠️',
      body: 'Olá ' + userId + ', você esqueceu o timer pausado!!! 💚',
      fcmToken: fcmToken,
      category: 'UN_DEFAULT_CATEGORY',
    }

    const options = {
      delay: 15000,
      attempts: 2,
      jobId: this.getUniqueId(userId),
    }

    this.notificationQueue.add(data, options)
  }

  scheduleWorkIdleAction(userId, fcmToken) {
    this.scheduleWorkIdleNotification(userId, fcmToken)

    const data = {
      userId: userId,
      description: 'moved_to_work_idle',
    }

    const options = {
      delay: 15000,
      attempts: 2,
      jobId: this.getUniqueId(userId),
    }

    this.idleSystemQueue.add(data, options)
  }

  scheduleBreakIdleAction(userId, fcmToken) {
    this.scheduleBreakIdleNotification(userId, fcmToken)

    const data = {
      userId: userId,
      description: 'moved_to_break_idle',
    }

    const options = {
      delay: 15000,
      attempts: 2,
      jobId: this.getUniqueId(userId),
    }

    this.idleSystemQueue.add(data, options)
  }

  schedulePauseIdleAction(userId, fcmToken) {
    this.schedulePauseIdleNotification(userId, fcmToken)

    const data = {
      userId: userId,
      description: 'moved_to_pause_idle',
    }

    const options = {
      delay: 15000,
      attempts: 2,
      jobId: this.getUniqueId(userId),
    }

    this.idleSystemQueue.add(data, options)
  }

  scheduleInativeAction(userId, fcmToken) {
    const data = {
      userId: userId,
      description: 'moved_to_inactive',
    }

    const options = {
      delay: 15000,
      attempts: 2,
      jobId: this.getUniqueId(userId),
    }

    this.idleSystemQueue.add(data, options)
  }
}

export default SchedulingFacade
