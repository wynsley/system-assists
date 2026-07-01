import Joi from "joi"

const STUDENT_STATUSES = [
  "ACTIVO", "INACTIVO", "SUSPENDIDO",
  "EXPULSADO", "TRANSFERIDO", "GRADUADO", "RETIRADO"
];

const ValidationUpdateStudent = Joi.object({
  firstname: Joi
    .string()
    .trim()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .min(2)
    .max(50)
    .messages({
      'string.min': 'El nombre debe tener mínimo 2 caracteres',
      'string.max': 'El nombre no puede tener más de 50 caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras y espacios'
    })
    .optional(),

  lastname: Joi
    .string()
    .trim()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .min(2)
    .max(50)
    .messages({
      'string.min': 'El apellido debe tener mínimo 2 caracteres',
      'string.max': 'El apellido no puede tener más de 50 caracteres',
      'string.pattern.base': 'El apellido solo puede contener letras y espacios'
    })
    .optional(),

  // dni sigue siendo requerido incluso en update (así está definido en el backend)
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
    .messages({
      'any.only': 'El sexo debe ser (M)asculino, (F)emenino u (O)tro'
    })
    .optional(),

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

  email: Joi
    .string()
    .trim()
    .email()
    .lowercase()
    .messages({
      'string.email': 'El correo no tiene un formato válido'
    })
    .allow('')
    .optional(),

  status: Joi
    .string()
    .valid(...STUDENT_STATUSES)
    .messages({
      'any.only': `El estado debe ser ${STUDENT_STATUSES.join(', ')}`
    })
    .optional(),
})

export { ValidationUpdateStudent }