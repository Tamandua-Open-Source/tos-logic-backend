import IStateMachineFacade from '../../application/facade-interfaces/i-state-machine-facade'

class StateMachineFacade extends IStateMachineFacade {
  constructor() {
    super()
  }

  canStartFrom(currentState) {
    return [this.inativeState].includes(currentState)
  }

  canFinishFrom(currentState) {
    return [this.workState, this.workIdleState].includes(currentState)
  }

  canWorkFrom(currentState) {
    return [this.breakState, this.breakIdleState].includes(currentState)
  }

  canBreakFrom(currentState) {
    return [this.workState, this.workIdleState].includes(currentState)
  }

  canPauseFrom(currentState) {
    return [this.workState, this.breakState].includes(currentState)
  }

  canResumeFrom(currentState) {
    return [this.pauseState, this.pauseIdleState].includes(currentState)
  }

  onStart() {
    return this.workState
  }

  onFinish() {
    return this.inativeState
  }

  onWork() {
    return this.workState
  }

  onBreak() {
    return this.breakState
  }

  onPause() {
    return this.pauseState
  }

  //adicionar 3o last state pq se não fica [pause-pause_idle] ai n sabe pra onde voltar
  onResume(lastState) {
    return lastState
  }
}

export default StateMachineFacade
