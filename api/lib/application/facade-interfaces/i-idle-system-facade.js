import { UnimplementedError } from '../../core/errors'

class IIdleSystemFacade {
  constructor() {
    this.workIdleState = 'WORK_IDLE'
    this.breakIdleState = 'BREAK_STATE'
    this.pauseIdleState = 'PAUSE_STATE'
    this.inactiveState = 'INACTIVE_STATE'
  }

  moveToWorkIdle({ userId }) {
    throw new UnimplementedError()
  }

  moveToBreakIdle({ userId }) {
    throw new UnimplementedError()
  }

  moveToPauseIdle({ userId }) {
    throw new UnimplementedError()
  }

  moveToInactive({ userId }) {
    throw new UnimplementedError()
  }
}

export default IIdleSystemFacade
