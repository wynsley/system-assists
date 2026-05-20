import { z } from "zod";

const userSchema = z.object(
  {
    firstname: z
      .string({ required_error: `El nombre es requerido` })
      .trim()
      .min(2, `El nombre debe tener mínimo 2 caracteres`)
      .max(50, `El nombre no puede tener más de 50 caracteres`)
      .regex(
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
        `El nombre solo puede contener letras y espacios`
      ),
    lastname: z
      .string({ required_error: `El apellido es requerido` })
      .trim()
      .min(2, `El apellido debe tener mínimo 2 caracteres`)
      .max(50, `El apellido no puede tener más de 50 caracteres`)
      .regex(
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
        `El apellido solo puede contener letras y espacios`
      ),
    email: z
      .string({ required_error: "El email es requerido" })
      .trim()
      .email("El email no tiene un formato válido")
      .toLowerCase(),
    password: z
      .string({ required_error: "La contraseña es requerida" })
      .trim()
      .min(8, "La contraseña debe tener mínimo 8 caracteres")
      .max(100, "La contraseña no puede tener más de 100 caracteres")
      .regex(/[a-zA-Z]/, "La contraseña debe tener al menos una letra")
      .regex(/[0-9]/, "La contraseña debe tener al menos un número"),
    repassword: z
      .string({ required_error: "Debes confirmar la contraseña" })
      .trim()
      .min(8, "La contraseña debe tener mínimo 8 caracteres"),
    role: z
      .enum(["ADMIN", "AUXILIAR", "PARENT"], {
        required_error: "El rol es requerido",
        message: "El rol debe ser AUXILIAR, PARENT o ADMIN",
      }
    ),
    phone: z.string()
    .regex(/^\+51\d{9}$/, "El teléfono debe tener formato +519XXXXXXXX")
    .optional()
    .or(z.literal(""))
  }
).refine(
  (data) => data.password === data.repassword, {
    message: "Las contraseñas no coinciden",
    path: ["repassword"],
  }
)

export { userSchema }
