import { Router } from "express";
import {
  authMiddleware,
  authMiddlewareRole,
} from "../../middlewares/auth.middleware.js";
import { attendanceController } from "./attendance.controller.js";

const attendanceRoutes = Router();

attendanceRoutes.post(
  "/",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  attendanceController.create,
);
attendanceRoutes.get(
  "/",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  attendanceController.get,
);
attendanceRoutes.get(
  "/summary/today",
  authMiddleware,
  authMiddlewareRole(["ADMIN",  "AUXILIAR"]),
  attendanceController.getSummaryToday,
);

attendanceRoutes.get(
  "/summary/grade",
  authMiddleware,
  authMiddlewareRole(["ADMIN"]),
  attendanceController.getSummaryByGrade,
);

attendanceRoutes.get(
  "/summary/behavior",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  attendanceController.getBehaviorSummary,
);

attendanceRoutes.get(
  "/summary/parent",
  authMiddleware,
  authMiddlewareRole(["PARENT"]),
  attendanceController.getSummaryByParent,
);
attendanceRoutes.get(
  "/:id",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  attendanceController.getById,
);
attendanceRoutes.patch(
  "/:id",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  attendanceController.update,
);
attendanceRoutes.delete(
  "/:id",
  authMiddleware,
  authMiddlewareRole(["ADMIN"]),
  attendanceController.delete,
);

export { attendanceRoutes };
