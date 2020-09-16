import ISchedulingFacade from '../../application/facade-interfaces/i-scheduling-facade'
import Queue from 'bull'

class SchedulingFacade extends ISchedulingFacade {
  constructor({ firebaseAdminFacade, idleSystemFacade }) {
    super()
    this.firebaseAdminFacade = firebaseAdminFacade
    this.idleSystemFacade = idleSystemFacade

    this.notificationQueue = new Queue('notification', {
      redis: {
        host: '127.0.0.1',
        port: 6379,
      },
    })

    this.notificationQueue.process(async (job) => {
      console.log('[BULL - notificationQueue] executing job ' + job.id)
      return await this.firebaseAdminFacade.send(
        job.data.title,
        job.data.body,
        job.data.category,
        job.data.fcmToken
      )
    })
  }

  removeAllScheduledPushNotifications(userId) {
    const pattern = userId + '*'
    this.notificationQueue.removeJobs(pattern).then(function () {
      console.log('[BULL - notificationQueue] removing jobs for ' + userId)
    })
  }

  removeAllScheduledIdleSystemActions(_userId) {
    console.log('removeAllScheduledIdleSystemActions')
  }

  scheduleStartCycleNotification(userId, _datetime) {
    const data = {
      userId: userId,
      title: 'START_CYCLE',
      body: 'Olá ' + userId + ', está na hora de começar a trabalhar.',
      fcmToken:
        'fB_deuQbPkTOsFUPrb_I45:APA91bHP6kNOOahgukAMDSMF9ppuOD832iN0204CJG_COQHC9HQW5cqTlR9zxPLtQXYXdragbmnmqI8rE2O9KJSN-vpN_AWyC5dv78f7VwKPCPkRRV97f0xMie8DLIP0ak0nNUqoRCu2',
      category: 'UN_START_CATEGORY',
    }

    const options = {
      delay: 5000,
      attempts: 2,
      jobId: userId + '-' + Date.now(),
    }

    this.notificationQueue.add(data, options)
  }

  scheduleNextBreakNotification(userId, _datetime) {
    const data = {
      userId: userId,
      title: 'NEXT_BREAK',
      body: 'Olá ' + userId + ', está na hora de fazer uma pausa',
      fcmToken:
        'fB_deuQbPkTOsFUPrb_I45:APA91bHP6kNOOahgukAMDSMF9ppuOD832iN0204CJG_COQHC9HQW5cqTlR9zxPLtQXYXdragbmnmqI8rE2O9KJSN-vpN_AWyC5dv78f7VwKPCPkRRV97f0xMie8DLIP0ak0nNUqoRCu2',
      category: 'UN_BREAK_START_CATEGORY',
    }

    const options = {
      delay: 5000,
      attempts: 2,
      jobId: userId + '-' + Date.now(),
    }

    this.notificationQueue.add(data, options)
  }

  scheduleNextWorkNotification(userId, _datetime) {
    const data = {
      userId: userId,
      title: 'NEXT_WORK',
      body: 'Olá ' + userId + ', está na hora de voltar a trabalhar',
      fcmToken:
        'fB_deuQbPkTOsFUPrb_I45:APA91bHP6kNOOahgukAMDSMF9ppuOD832iN0204CJG_COQHC9HQW5cqTlR9zxPLtQXYXdragbmnmqI8rE2O9KJSN-vpN_AWyC5dv78f7VwKPCPkRRV97f0xMie8DLIP0ak0nNUqoRCu2',
      category: 'UN_BREAK_END_CATEGORY',
    }

    const options = {
      delay: 5000,
      attempts: 2,
      jobId: userId + '-' + Date.now(),
    }

    this.notificationQueue.add(data, options)
  }

  scheduleWorkIdleNotification(_userId, _datetime) {
    console.log('scheduleWorkIdleNotification')
  }

  scheduleBreakIdleNotification(_userId, _datetime) {
    console.log('scheduleBreakIdleNotification')
  }

  schedulePauseIdleNotification(_userId, _datetime) {
    console.log('schedulePauseIdleNotification')
  }

  scheduleWorkIdleAction(_userId, _datetime) {
    console.log('scheduleWorkIdleAction')
  }

  scheduleBreakIdleAction(_userId, _datetime) {
    console.log('scheduleBreakIdleAction')
  }

  schedulePauseIdleAction(_userId, _datetime) {
    console.log('schedulePauseIdleAction')
  }

  scheduleInativeAction(_userId, _datetime) {
    console.log('scheduleInativeAction')
  }
}

export default SchedulingFacade
