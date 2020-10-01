import IUserDataFacade from '../../application/facade-interfaces/i-user-data-facade'

//conectar essa facade com a API de dados
class UserDataFacade extends IUserDataFacade {
  async getUserData(userId) {
    return {
      fcmToken:
        'fB_deuQbPkTOsFUPrb_I45:APA91bHP6kNOOahgukAMDSMF9ppuOD832iN0204CJG_COQHC9HQW5cqTlR9zxPLtQXYXdragbmnmqI8rE2O9KJSN-vpN_AWyC5dv78f7VwKPCPkRRV97f0xMie8DLIP0ak0nNUqoRCu2',
      name: 'Otavinho do gueto e coisarada',
    }
  }
}

export default UserDataFacade
