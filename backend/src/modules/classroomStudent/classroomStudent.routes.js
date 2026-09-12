import { Router } from "express";
import {
  authMiddleware,
  authMiddlewareRole,
} from "../../middlewares/auth.middleware.js";

import { classroomStudentController } from "./classroomStudent.controller.js";

const classroomStudentRoutes = Router();

classroomStudentRoutes.post(
  "/",
  authMiddleware,
  authMiddlewareRole(["ADMIN"]),
  classroomStudentController.create,
);

classroomStudentRoutes.get(
  "/",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  classroomStudentController.get,
);

classroomStudentRoutes.get(
  "/roster",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR"]),
  classroomStudentController.getRosterByClassroomPage,
);

classroomStudentRoutes.get(
  "/:id",
  authMiddleware,
  authMiddlewareRole(["ADMIN", "AUXILIAR", "PARENT"]),
  classroomStudentController.getById,
);

classroomStudentRoutes.patch(
  "/:id",
  authMiddleware,
  authMiddlewareRole(["ADMIN"]),
  classroomStudentController.update,
);

classroomStudentRoutes.delete(
  "/:id",
  authMiddleware,
  authMiddlewareRole(["ADMIN"]),
  classroomStudentController.delete,
);

export { classroomStudentRoutes };
