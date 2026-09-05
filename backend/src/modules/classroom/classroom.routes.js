import { Router } from "express";
import {
  authMiddleware,
  authMiddlewareRole,
} from "../../middlewares/auth.middleware.js";

import { classroomController } from "./classroom.controller.js";

const classroomRoutes = Router();

classroomRoutes.post(
  "/",
  authMiddleware,
  authMiddlewareRole(["ADMIN"]),
  classroomController.create,
);

classroomRoutes.get(
  "/",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  classroomController.get,
);

classroomRoutes.get(
  "/years",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  classroomController.getYears,
);

classroomRoutes.get(
  "/:id",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  classroomController.getById,
);

classroomRoutes.patch(
  "/:id",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  classroomController.update,
);

classroomRoutes.delete(
  "/:id",
  authMiddleware,
  authMiddlewareRole(["ADMIN"]),
  classroomController.delete,
);

export { classroomRoutes };
