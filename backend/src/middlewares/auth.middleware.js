import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

const authMiddleware = async (req, res, next) => {
  if (!req.cookies)
    return next(
      new AppError("Sin autorización", 401, { message: "Sin autorización" }),
    );

  let token = req.cookies.token;
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }
  if (!token)
    return next(
      new AppError("Sin autorización", 401, { message: "Sin autorización" }),
    );

  try {
    const userDecoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = userDecoded;
    next();
  } catch {
    next(new AppError("Token inválido o expirado", 401));
  }
};

const authMiddlewareRole = (roles) => {
  return async (req, res, next) => {
    if (!req.user)
      return next(
        new AppError("Sin autorización", 401, { message: "Sin autorización" }),
      );

    const { role } = req.user;
    if (!roles.includes(role)){
      return next(
        new AppError("Sin autorización", 401, { message: "Sin autorización" }),
      );
    }
    next();
  };
};

export { authMiddleware, authMiddlewareRole };
