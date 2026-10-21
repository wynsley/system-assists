import Joi from "joi";

const STUDENT_STATUSES = [
  "ACTIVO", "INACTIVO", "SUSPENDIDO",
  "EXPULSADO", "TRANSFERIDO", "GRADUADO", "RETIRADO",
];

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

const ValidationCreateStudent = Joi.object({
  firstname: Joi.string().trim().pattern(NAME_REGEX).min(2).max(50).required()
    .messages({
      "string.empty": "El nombre es requerido",
      "string.min": "El nombre debe tener mínimo 2 caracteres",
      "string.max": "El nombre no puede tener más de 50 caracteres",
      "string.pattern.base": "El nombre solo puede contener letras y espacios",
      "any.required": "El nombre es requerido",
    }),

  lastname: Joi.string().trim().pattern(NAME_REGEX).min(2).max(50).required()
    .messages({
      "string.empty": "El apellido es requerido",
      "string.min": "El apellido debe tener mínimo 2 caracteres",
      "string.max": "El apellido no puede tener más de 50 caracteres",
      "string.pattern.base": "El apellido solo puede contener letras y espacios",
      "any.required": "El apellido es requerido",
    }),

  dni: Joi.string().trim().pattern(/^\d{8}$/).required()
    .messages({
      "string.empty": "El DNI es requerido",
      "string.pattern.base": "El DNI debe tener exactamente 8 dígitos numéricos",
      "any.required": "El DNI es requerido",
    }),

  gender: Joi.string().valid("M", "F", "O").required()
    .messages({
      "any.only": "El sexo debe ser (M)asculino, (F)emenino u (O)tro",
      "string.empty": "El sexo es requerido",
      "any.required": "El sexo es requerido",
    }),

  status: Joi.string().valid(...STUDENT_STATUSES).required()
    .messages({
      "any.only": `El estado debe ser: ${STUDENT_STATUSES.join(", ")}`,
      "string.empty": "El estado es requerido",
      "any.required": "El estado es requerido",
    }),

  phone: Joi.string().trim().replace(/\s+/g, "").empty("")
    .pattern(/^9\d{8}$/)
    .messages({
      "string.pattern.base": "El teléfono debe tener 9 dígitos y empezar con 9",
    }),

  email: Joi.string().trim().lowercase().email({ tlds: false }).max(100).empty("")
    .messages({
      "string.email": "El correo no tiene un formato válido",
      "string.max": "El correo no puede tener más de 100 caracteres",
    }),
});

export { ValidationCreateStudent, STUDENT_STATUSES };