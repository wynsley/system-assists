import jwt from "jsonwebtoken";
import { hash as bcryptHash } from "bcrypt";

const generatePasswordHash = async (password) => {
  const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10
  const passwordHash = await bcryptHash(password, SALT_ROUNDS)
  return passwordHash
}

const generateToken = async (credentials) => {
  const payload = {
    sub: credentials.idUser,
    role: credentials.role,
  };

  const jwtSecret = process.env.JWT_SECRET || "secret";
  const token = await jwt.sign(payload, jwtSecret, { expiresIn: "8h" });
  return token;
};

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 8, // 8 horas
};

export { COOKIE_OPTIONS, generateToken, generatePasswordHash };
