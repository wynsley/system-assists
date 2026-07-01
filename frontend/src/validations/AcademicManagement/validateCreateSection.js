import Joi from "joi"

const ValidationCreateSection = Joi.object({
  name: Joi
    .string()
    .trim()
    .min(1)
    .max(1)
    .pattern(/^[A-Za-z]+$/)
    .uppercase()
    .required()
    .messages({
      'string.empty': 'El nombre de sección es requerido',
      'string.min': 'El nombre de sección es requerido',
      'string.max': 'El nombre de sección solo puede ser una letra',
      'string.pattern.base': 'El nombre de sección solo puede contener letras',
      'any.required': 'El nombre de sección es requerido'
    }),

  idGrade: Joi
    .string()
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'El ID del grado es requerido',
      'string.pattern.base': 'El ID del grado debe ser un número entero',
      'any.required': 'El ID del grado es requerido'
    }),
})

export { ValidationCreateSection }