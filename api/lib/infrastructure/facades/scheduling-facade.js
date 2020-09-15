import ISchedulingFacade from '../../application/facade-interfaces/i-scheduling-facade'

class SchedulingFacade extends ISchedulingFacade {
  constructor({ firebaseAdminFacade, idleSystemFacade }) {
    super()
    this.firebaseAdminFacade = firebaseAdminFacade
    this.idleSystemFacade = idleSystemFacade
  }

  removeAllScheduledPushNotifications(_userId) {
    console.log('removeAllScheduledPushNotifications')
  }

  removeAllScheduledIdleSystemActions(_userId) {
    console.log('removeAllScheduledIdleSystemActions')
  }

  scheduleStartCycleNotification(_userId, _datetime) {
    console.log('scheduleStartCycleNotification')
  }

  scheduleNextBreakNotification(_userId, _datetime) {
    console.log('scheduleNextBreakNotification')
  }

  scheduleNextWorkNotification(_userId, _datetime) {
    console.log('scheduleNextWorkNotification')
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
