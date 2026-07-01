import Joi from "joi"

const CLASSROOM_STATUSES = ["ACTIVO", "INACTIVO"];

const ValidationCreateClassroom = Joi.object({
  year: Joi
    .number()
    .integer()
    .min(1900)
    .max(3000)
    .required()
    .messages({
      'number.base': 'El año debe ser un número',
      'number.integer': 'El año debe ser un número entero',
      'number.min': 'El año debe ser mayor o igual a 1900',
      'number.max': 'El año no puede ser mayor a 3000',
      'any.required': 'El año es requerido'
    }),

  idSection: Joi
    .string()
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'El ID de la sección es requerido',
      'string.pattern.base': 'El ID de la sección debe ser un número entero',
      'any.required': 'El ID de la sección es requerido'
    }),

  status: Joi
    .string()
    .valid(...CLASSROOM_STATUSES)
    .messages({
      'any.only': `El estado debe ser ${CLASSROOM_STATUSES.join(', ')}`
    })
    .optional(),
})

export { ValidationCreateClassroom }