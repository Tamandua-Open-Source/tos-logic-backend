import { UnimplementedError } from '../../core/errors'

class ISchedulingFacade {
  assignStateMachineFacade({ stateMachineFacade }) {
    throw new UnimplementedError()
  }

  buildJobId(_userId) {
    throw new UnimplementedError()
  }

  removeJobsOnNotificationQueue({ userId }) {
    throw new UnimplementedError()
  }

  removeJobsOnStateQueue({ userId }) {
    throw new UnimplementedError()
  }

  scheduleNotification({ userId, title, body, category, fcmToken, delay }) {
    throw new UnimplementedError()
  }

  scheduleState({ userId, state, delay }) {
    throw new UnimplementedError()
  }
}

export default ISchedulingFacade
