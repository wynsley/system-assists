import { Router } from "express";
import {
  authMiddleware,
  authMiddlewareRole,
} from "../../middlewares/auth.middleware.js";
import { behaviorController } from "./behavior.controller.js";

const behaviorRoutes = Router();

behaviorRoutes.get(
  "/roster",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  behaviorController.getRoster,
);

behaviorRoutes.get(
  "/consolidado",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  behaviorController.getConsolidado,
);

behaviorRoutes.post(
  "/calificar",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  behaviorController.calificar,
);

export { behaviorRoutes };