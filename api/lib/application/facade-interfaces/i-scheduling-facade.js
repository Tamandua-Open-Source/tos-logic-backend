import { UnimplementedError } from '../../core/errors'

class ISchedulingFacade {
  removeAllScheduledPushNotifications(_userId) {
    throw new UnimplementedError()
  }

  removeAllScheduledIdleSystemActions(_userId) {
    throw new UnimplementedError()
  }

  scheduleStartCycleNotification(_userId, _fcmToken) {
    throw new UnimplementedError()
  }

  scheduleNextBreakNotification(_userId, _fcmToken) {
    throw new UnimplementedError()
  }

  scheduleNextWorkNotification(_userId, _fcmToken) {
    throw new UnimplementedError()
  }

  scheduleWorkIdleNotification(_userId, _fcmToken) {
    throw new UnimplementedError()
  }

  scheduleBreakIdleNotification(_userId, _fcmToken) {
    throw new UnimplementedError()
  }

  schedulePauseIdleNotification(_userId, _fcmToken) {
    throw new UnimplementedError()
  }

  scheduleWorkIdleAction(_userId, _datetime) {
    throw new UnimplementedError()
  }

  scheduleBreakIdleAction(_userId, _datetime) {
    throw new UnimplementedError()
  }

  schedulePauseIdleAction(_userId, _datetime) {
    throw new UnimplementedError()
  }

  scheduleInativeAction(_userId, _datetime) {
    throw new UnimplementedError()
  }
}

export default ISchedulingFacade
