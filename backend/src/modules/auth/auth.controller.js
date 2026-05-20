import { compare as validatePassword } from "bcrypt";
import { AppError } from "../../utils/AppError.js";
import { authService } from "./auth.service.js";
import { loginSchema } from "./auth.schema.js";
import { COOKIE_OPTIONS, generateToken } from "../../utils/auth.utils.js";

const authController = {
  login: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const validate = await loginSchema.safeParseAsync({ email, password });
      if (!validate.success)
        throw new AppError(validate.error.issues[0].message, 400, {
          message: validate.error.issues[0].message,
        });

      const credentials = await authService.getCredentials({ email });

      if (!credentials)
        throw new AppError("Usuario y/o contraseña incorrectos", 400, {});

      const isPasswordCorrect = await validatePassword(
        password,
        credentials.passwordHash,
      );
      if (!isPasswordCorrect)
        throw new AppError("Usuario y/o contraseña incorrectos", 400, {});

      const token = await generateToken(credentials);
      res.cookie("token", token, COOKIE_OPTIONS);

      return res.json({
        message: `Bienvenido ${credentials.firstname} ${credentials.lastname}`,
        email: credentials.email,
        firstname: credentials.firstname,
        lastname: credentials.lastname,
        role: credentials.role,
      });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      if (!req.cookies.token) throw new AppError("Sin autorización", 401, { message: "Sin autorización" })

      res.clearCookie("token", COOKIE_OPTIONS)

      return res.json({
        message: "Sesión cerrada correctamente"
      });
    } catch (error) {
      next(error);
    }
  }
};

export { authController };
