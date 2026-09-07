import { Router } from "express";
import { authMiddleware, authMiddlewareRole } from "../../middlewares/auth.middleware.js";
import { academicPeriodController } from "./academicPeriod.controller.js";

const academicPeriodRoutes = Router();

academicPeriodRoutes.post(
  "/", 
  authMiddleware, 
  authMiddlewareRole(["ADMIN"]), 
  academicPeriodController.create
);
academicPeriodRoutes.get(
  "/", 
  authMiddleware, 
  authMiddlewareRole(["ADMIN", "AUXILIAR"]), 
  academicPeriodController.get
);
academicPeriodRoutes.get(
  "/current", 
  authMiddleware, 
  authMiddlewareRole(["ADMIN", "AUXILIAR"]), 
  academicPeriodController.getCurrent
);
academicPeriodRoutes.get(
  "/:id", 
  authMiddleware, 
  authMiddlewareRole(["ADMIN", "AUXILIAR"]), 
  academicPeriodController.getById
);
academicPeriodRoutes.patch(
  "/:id", 
  authMiddleware, 
  authMiddlewareRole(["ADMIN"]), 
  academicPeriodController.update
);
academicPeriodRoutes.delete(
  "/:id", 
  authMiddleware, 
  authMiddlewareRole(["ADMIN"]), 
  academicPeriodController.delete
);

export { academicPeriodRoutes };