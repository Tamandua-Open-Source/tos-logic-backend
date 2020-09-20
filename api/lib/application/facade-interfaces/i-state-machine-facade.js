import { UnimplementedError } from '../../core/errors'

class IStateMachineFacade {
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

  onStart({ userId }) {
    throw new UnimplementedError()
  }

  onFinish({ userId }) {
    throw new UnimplementedError()
  }

  onWork({ userId, elapsedDuration }) {
    throw new UnimplementedError()
  }

  onBreak({ userId, elapsedDuration }) {
    throw new UnimplementedError()
  }

  onPause({ userId }) {
    throw new UnimplementedError()
  }

  onResume({ userId }) {
    throw new UnimplementedError()
  }

  onWorkIdle({ userId }) {
    throw new UnimplementedError()
  }

  onBreakIdle({ userId }) {
    throw new UnimplementedError()
  }

  onPauseIdle({ userId }) {
    throw new UnimplementedError()
  }

  onInactive({ userId }) {
    throw new UnimplementedError()
  }
}

export default IStateMachineFacade
