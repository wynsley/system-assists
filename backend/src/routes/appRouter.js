import { Router } from "express";
import { authRouter } from "../modules/auth/auth.router.js";
import { auxiliarRouter } from "../modules/user/auxiliar/auxiliar.router.js";
import { errorsMiddleware } from "../middlewares/errors.middleware.js";
import { authMiddleware, authMiddlewareRole } from "../middlewares/auth.middleware.js";

const appRouter = Router()

appRouter.get('/protected', authMiddleware, authMiddlewareRole(['AUXILIAR']), async (req, res) => {
  console.log(req.user)
  return res.json({ message: 'Bienvenido a la API de sistema assistentes' })
})

appRouter.use('/', authRouter)
appRouter.use('/auxiliar', auxiliarRouter)

appRouter.use(errorsMiddleware)

export { appRouter }