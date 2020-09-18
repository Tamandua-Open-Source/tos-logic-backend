import IIdleSystemFacade from '../../application/facade-interfaces/i-idle-system-facade'

class IdleSystemFacade extends IIdleSystemFacade {
  constructor({ userRepository, stateMachineFacade }) {
    super()
    this.userRepository = userRepository
    this.stateMachineFacade = stateMachineFacade
  }

  async moveToIdleState({ idleState, userId }) {
    switch (idleState) {
      case this.workIdleState:
        return this.moveToWorkIdle({ userId })
      case this.breakIdleState:
        return this.moveToBreakIdle({ userId })
      case this.pauseIdleState:
        return this.moveToPauseIdle({ userId })
      case this.inactiveState:
        return this.moveToInactive({ userId })
      default:
        return this.moveToInactive({ userId })
    }
  }

  async moveToWorkIdle({ userId }) {
    console.log('[IDLE_SYSTEM_FACADE] - State changed to WORK_IDLE')
    return await this.userRepository.patchUserPreferences(userId, {
      currentState: this.stateMachineFacade.workIdleState,
    })
  }

  async moveToBreakIdle({ userId }) {
    console.log('[IDLE_SYSTEM_FACADE] - State changed to BREAK_IDLE')
    return await this.userRepository.patchUserPreferences(userId, {
      currentState: this.stateMachineFacade.breakIdleState,
    })
  }

  async moveToPauseIdle({ userId }) {
    console.log('[IDLE_SYSTEM_FACADE] - State changed to PAUSE_IDLE')
    return await this.userRepository.patchUserPreferences(userId, {
      currentState: this.stateMachineFacade.pauseIdleState,
    })
  }

  async moveToInactive({ userId }) {
    console.log('[IDLE_SYSTEM_FACADE] - State changed to INACTIVE')
    return await this.userRepository.patchUserPreferences(userId, {
      currentState: this.stateMachineFacade.inactiveState,
    })
  }
}

export default IdleSystemFacade
