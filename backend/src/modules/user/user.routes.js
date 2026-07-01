import { Router } from "express";
import {
  authMiddleware,
  authMiddlewareRole,
} from "../../middlewares/auth.middleware.js";
import { userController } from "./user.controller.js";

const userRoutes = Router();

userRoutes.post(
  "/",
  authMiddleware,
  authMiddlewareRole(["ADMIN"]),
  userController.create,
);

userRoutes.get(
  "/",
  authMiddleware,
  authMiddlewareRole(["ADMIN"]),
  userController.get,
);

userRoutes.get("/dashboard", authMiddleware, userController.dashboard);

userRoutes.get(
  "/:id",
  authMiddleware,
  authMiddlewareRole(["ADMIN"]),
  userController.getById,
);

userRoutes.patch(
  "/:id",
  authMiddleware,
  authMiddlewareRole(["ADMIN"]),
  userController.update,
);

userRoutes.delete(
  "/:id",
  authMiddleware,
  authMiddlewareRole(["ADMIN"]),
  userController.delete,
);

export { userRoutes };
