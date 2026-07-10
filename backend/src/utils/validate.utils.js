import z from "zod";
import { AppError } from "./AppError.js";

const validateUtils = {
  validateBody: ({ data, ctx, fields }) => {
    console.log(data, ctx, fields);
    // validar que haya al menos un campo
    const hasAtLeastOneField = fields.some(
      (field) => data[field] !== undefined,
    );

    if (!hasAtLeastOneField) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["body"],
        message: "Debes enviar al menos un campo",
      });
    }
  },
  verifyPasswords: ({ data, ctx }) => {
    // Si envía password pero no repassword
    if (data.password && !data.repassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["repassword"],
        message: "Debes confirmar la contraseña",
      });
    }
    // Si envía repassword pero no password
    if (!data.password && data.repassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Debes enviar una contraseña",
      });
    }
    // Si ambas existen pero no coinciden
    if (data.password && data.repassword && data.password !== data.repassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["repassword"],
        message: "Las contraseñas no coinciden",
      });
    }
  },
  validateSchema: async ({ schema, data }) => {
    const validate = await schema.safeParseAsync(data);

    if (!validate.success) {
      const errors = validate.error.issues.flatMap((issue) => {
        if (issue.code === "unrecognized_keys") {
          return issue.keys.map((key) => ({
            field: key,
            message: "No se permiten campos adicionales",
          }));
        }

        return {
          field: issue.path.length > 0 ? issue.path.join(".") : "general",
          message: issue.message,
        };
      });
      throw new AppError("Error de validación", 400, errors);
    }
    return validate.data;
  },
  buildOrderBy: (sortBy, sortOrder) => {
  const nested = {
    grade: { section: { grade: { level: sortOrder } } },
    section: { section: { name: sortOrder } },
    lastname: { student: { lastname: sortOrder } }, 
  };
  return nested[sortBy] ?? { [sortBy]: sortOrder };
},
};

export { validateUtils };
