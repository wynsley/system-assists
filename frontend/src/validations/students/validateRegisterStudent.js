import Joi from "joi"

const STUDENT_STATUSES = [
  "ACTIVO", "INACTIVO", "SUSPENDIDO",
  "EXPULSADO", "TRANSFERIDO", "GRADUADO", "RETIRADO"
];

const ValidationCreateStudent = Joi.object({
  firstname: Joi
    .string()
    .trim()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El nombre no puede estar vacío',
      'string.min': 'El nombre debe tener mínimo 2 caracteres',
      'string.max': 'El nombre no puede tener más de 50 caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras y espacios',
      'any.required': 'El nombre es requerido'
    }),

  lastname: Joi
    .string()
    .trim()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El apellido no puede estar vacío',
      'string.min': 'El apellido debe tener mínimo 2 caracteres',
      'string.max': 'El apellido no puede tener más de 50 caracteres',
      'string.pattern.base': 'El apellido solo puede contener letras y espacios',
      'any.required': 'El apellido es requerido'
    }),

  dni: Joi
    .string()
    .trim()
    .length(8)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.empty': 'El DNI es requerido',
      'string.length': 'El DNI debe tener 8 caracteres',
      'string.pattern.base': 'El DNI debe ser numérico',
      'any.required': 'El DNI es requerido'
    }),

  gender: Joi
    .string()
    .valid('M', 'F', 'O')
    .required()
    .messages({
      'any.only': 'El sexo debe ser (M)asculino, (F)emenino u (O)tro',
      'string.empty': 'El sexo es requerido',
      'any.required': 'El sexo es requerido'
    }),

  phone: Joi
    .string()
    .trim()
    .custom((value) => value.replace(/\s+/g, ""))
    .pattern(/^\+51\d{9}$/)
    .messages({
      'string.pattern.base': 'El teléfono debe tener formato +51 9XX XXX XXX'
    })
    .allow('')
    .optional(),

  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .allow('')
    .optional()
    .messages({
      'string.email': 'El correo no tiene un formato válido',
    }),

  status: Joi
    .string()
    .valid(...STUDENT_STATUSES)
    .messages({
      'any.only': `El estado debe ser ${STUDENT_STATUSES.join(', ')}`
    })
    .optional(),
})

export { ValidationCreateStudent }