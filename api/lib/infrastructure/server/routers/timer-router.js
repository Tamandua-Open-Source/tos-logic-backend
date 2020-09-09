import { Router } from 'express'
import ExpressRouterAdapter from '../../../interfaces/express-adapters/express-router-adapter'
import ExpressMiddlewareAdapter from '../../../interfaces/express-adapters/express-middleware-adapter'
import TimerControllerComposer from '../../../interfaces/controllers/composers/timer-controller-composer'
import AuthMiddlewareComposer from '../../../interfaces/middlewares/composers/auth-middleware-composer'

const timerController = TimerControllerComposer.compose()
const authMiddleware = AuthMiddlewareComposer.compose()

const router = Router()

router.post(
  '/start',
  ExpressMiddlewareAdapter.adapt((req) => authMiddleware.verifyToken(req)),
  ExpressRouterAdapter.adapt((req) => timerController.startTimer(req))
)

router.post(
  '/finish',
  ExpressMiddlewareAdapter.adapt((req) => authMiddleware.verifyToken(req)),
  ExpressRouterAdapter.adapt((req) => timerController.finishTimer(req))
)

router.post(
  '/work',
  ExpressMiddlewareAdapter.adapt((req) => authMiddleware.verifyToken(req)),
  ExpressRouterAdapter.adapt((req) => timerController.workTimer(req))
)

router.post(
  '/break',
  ExpressMiddlewareAdapter.adapt((req) => authMiddleware.verifyToken(req)),
  ExpressRouterAdapter.adapt((req) => timerController.breakTimer(req))
)

router.post(
  '/pause',
  ExpressMiddlewareAdapter.adapt((req) => authMiddleware.verifyToken(req)),
  ExpressRouterAdapter.adapt((req) => timerController.pauseTimer(req))
)

router.post(
  '/resume',
  ExpressMiddlewareAdapter.adapt((req) => authMiddleware.verifyToken(req)),
  ExpressRouterAdapter.adapt((req) => timerController.resumeTimer(req))
)

export default router
