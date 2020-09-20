import { UnimplementedError } from '../../core/errors'

class ISchedulingFacade {
  removeAllScheduledPushNotifications({ userId }) {
    throw new UnimplementedError()
  }

  removeAllScheduledIdleSystemActions({ userId }) {
    throw new UnimplementedError()
  }

  scheduleStartCycleNotification({ userId, fcmToken, delay }) {
    throw new UnimplementedError()
  }

  scheduleNextBreakNotification({ userId, fcmToken, delay }) {
    throw new UnimplementedError()
  }

  scheduleNextWorkNotification({ userId, fcmToken, delay }) {
    throw new UnimplementedError()
  }

  scheduleWorkIdleNotification({ userId, fcmToken, delay }) {
    throw new UnimplementedError()
  }

  scheduleBreakIdleNotification({ userId, fcmToken, delay }) {
    throw new UnimplementedError()
  }

  schedulePauseIdleNotification({ userId, fcmToken, delay }) {
    throw new UnimplementedError()
  }

  scheduleInactiveNotification({ userId, fcmToken, delay }) {
    throw new UnimplementedError()
  }

  scheduleWorkIdleAction({
    userId,
    fcmToken,
    delay,
    delayToInactive,
    delayStartCycle,
  }) {
    throw new UnimplementedError()
  }

  scheduleBreakIdleAction({
    userId,
    fcmToken,
    delay,
    delayToInactive,
    delayStartCycle,
  }) {
    throw new UnimplementedError()
  }

  schedulePauseIdleAction({
    userId,
    fcmToken,
    delay,
    delayToInactive,
    delayStartCycle,
  }) {
    throw new UnimplementedError()
  }

  scheduleInactiveAction({ userId, fcmToken, delay, delayStartCycle }) {
    throw new UnimplementedError()
  }
}

export default ISchedulingFacade
