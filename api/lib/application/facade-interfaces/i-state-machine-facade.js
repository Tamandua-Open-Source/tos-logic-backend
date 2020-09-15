import { UnimplementedError } from '../../core/errors'

class IStateMachineFacade {
  constructor() {
    this.inativeState = 'INATIVE'
    this.workState = 'WORK'
    this.breakState = 'BREAK'
    this.pauseState = 'PAUSE'
    this.workIdleState = 'WORK_IDLE'
    this.breakIdleState = 'BREAK_IDLE'
    this.pauseIdleState = 'PAUSE_IDLE'
  }

  canStartFrom(_currentState) {
    throw new UnimplementedError()
  }

  canFinishFrom(_currentState) {
    throw new UnimplementedError()
  }

  canWorkFrom(_currentState) {
    throw new UnimplementedError()
  }

  canBreakFrom(_currentState) {
    throw new UnimplementedError()
  }

  canPauseFrom(_currentState) {
    throw new UnimplementedError()
  }

  canResumeFrom(_currentState) {
    throw new UnimplementedError()
  }

  onStart() {
    throw new UnimplementedError()
  }

  onFinish() {
    throw new UnimplementedError()
  }

  onWork() {
    throw new UnimplementedError()
  }

  onBreak() {
    throw new UnimplementedError()
  }

  onPause() {
    throw new UnimplementedError()
  }

  onResume(_lastState) {
    throw new UnimplementedError()
  }
}

export default IStateMachineFacade
