import { Router } from "express";
import {
  authMiddleware,
  authMiddlewareRole,
} from "../../middlewares/auth.middleware.js";
import { nonSchoolDayController } from "./nonSchoolDay.controller.js";

const nonSchoolDayRoutes = Router();

nonSchoolDayRoutes.post(
  "/",
  authMiddleware,
  authMiddlewareRole(["ADMIN"]),
  nonSchoolDayController.create,
);

// Lectura abierta a ADMIN y AUXILIAR (útil si algún día quieres avisarles en su roster)
nonSchoolDayRoutes.get(
  "/",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  nonSchoolDayController.get,
);

nonSchoolDayRoutes.get(
  "/:id",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  nonSchoolDayController.getById,
);

nonSchoolDayRoutes.patch(
  "/:id",
  authMiddleware,
  authMiddlewareRole(["ADMIN"]),
  nonSchoolDayController.update,
);

nonSchoolDayRoutes.delete(
  "/:id",
  authMiddleware,
  authMiddlewareRole(["ADMIN"]),
  nonSchoolDayController.delete,
);

export { nonSchoolDayRoutes };