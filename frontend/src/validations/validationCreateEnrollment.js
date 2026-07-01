import Joi from "joi"

const ValidationCreateEnrollment = Joi.object({
  idClassroom: Joi
    .string()
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'El ID del salón de clase es requerido',
      'string.pattern.base': 'El ID del salón de clase debe ser un número entero',
      'any.required': 'El ID del salón de clase es requerido'
    }),

  idStudent: Joi
    .string()
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'El ID del estudiante es requerido',
      'string.pattern.base': 'El ID del estudiante debe ser un número entero',
      'any.required': 'El ID del estudiante es requerido'
    }),
})

export { ValidationCreateEnrollment }