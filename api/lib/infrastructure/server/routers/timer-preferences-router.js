import { Router } from 'express'
import ExpressRouterAdapter from '../../../interfaces/express-adapters/express-router-adapter'
import ExpressMiddlewareAdapter from '../../../interfaces/express-adapters/express-middleware-adapter'

import TimerPreferencesControllerComposer from '../../../interfaces/controllers/composers/timer-preferences-controller-composer'

import ApiKeyMiddlewareComposer from '../../../interfaces/middlewares/composers/api-key-middleware-composer'
import AuthMiddlewareComposer from '../../../interfaces/middlewares/composers/auth-middleware-composer'

const timerPreferencesController = TimerPreferencesControllerComposer.compose()
const authMiddleware = AuthMiddlewareComposer.compose()
const apiKeyMiddleware = ApiKeyMiddlewareComposer.compose()

const router = Router()

router.get(
  '/',
  ExpressMiddlewareAdapter.adapt((req) => authMiddleware.verifyToken(req)),
  ExpressRouterAdapter.adapt((req) =>
    timerPreferencesController.getTimerPreferences(req)
  )
)

router.patch(
  '/',
  ExpressMiddlewareAdapter.adapt((req) => authMiddleware.verifyToken(req)),
  ExpressRouterAdapter.adapt((req) =>
    timerPreferencesController.patchTimerPreferences(req)
  )
)

router.post(
  '/subscribe/:userId',
  ExpressMiddlewareAdapter.adapt((req) => apiKeyMiddleware.verifyApiKey(req)),
  ExpressRouterAdapter.adapt((req) =>
    timerPreferencesController.subscribeUserPreferencesByUserId(req)
  )
)

router.delete(
  '/unsubscribe/:userId',
  ExpressMiddlewareAdapter.adapt((req) => apiKeyMiddleware.verifyApiKey(req)),
  ExpressRouterAdapter.adapt((req) =>
    timerPreferencesController.unsubscribeUserPreferencesByUserId(req)
  )
)

router.post(
  '/subscribe',
  ExpressMiddlewareAdapter.adapt((req) => authMiddleware.verifyToken(req)),
  ExpressRouterAdapter.adapt((req) =>
    timerPreferencesController.createUserPreferences(req)
  )
)

router.delete(
  '/unsubscribe',
  ExpressMiddlewareAdapter.adapt((req) => authMiddleware.verifyToken(req)),
  ExpressRouterAdapter.adapt((req) =>
    timerPreferencesController.deleteTimerPreferences(req)
  )
)

export default router
