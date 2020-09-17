import IIdleSystemFacade from '../../application/facade-interfaces/i-idle-system-facade'

class IdleSystemFacade extends IIdleSystemFacade {
  constructor({ userRepository }) {
    super()
    this.userRepository = userRepository
  }

  async moveToWorkIdle() {
    console.log('moveToWorkIdle')
  }

  async moveToWorkIdle() {
    console.log('moveToWorkIdle')
  }

  async moveToPauseIdle() {
    console.log('moveToPauseIdle')
  }

  async moveToInactive() {
    console.log('moveToInative')
  }
}

export default IdleSystemFacade
