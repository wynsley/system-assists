import Joi from "joi"

const ValidationCreateGrade = Joi.object({
  level: Joi
    .number()
    .integer()
    .min(0)
    .max(15)
    .required()
    .messages({
      'number.base': 'El grado debe ser un número',
      'number.integer': 'El grado debe ser un número entero',
      'number.min': 'El grado debe ser mayor o igual a 0',
      'number.max': 'El grado no puede ser mayor a 15',
      'any.required': 'El grado es requerido'
    }),
})

const ValidationGradeParams = Joi.object({
  id: Joi
    .string()
    .pattern(/^\d+$/)
    .messages({
      'string.pattern.base': 'El ID del grado debe ser un número entero'
    })
    .optional(),

  page: Joi
    .number()
    .integer()
    .min(1)
    .max(1000)
    .default(1)
    .messages({
      'number.base': 'La página debe ser un número',
      'number.integer': 'La página debe ser un número entero',
      'number.min': 'La página debe ser mayor o igual a 1',
      'number.max': 'La página no puede ser mayor a 1000'
    })
    .optional(),

  limit: Joi
    .number()
    .integer()
    .min(1)
    .max(10)
    .default(10)
    .messages({
      'number.base': 'El límite debe ser un número',
      'number.integer': 'El límite debe ser un número entero',
      'number.min': 'El límite debe ser mayor o igual a 1',
      'number.max': 'El límite no puede ser mayor a 10'
    })
    .optional(),

  sortOrder: Joi
    .string()
    .valid('asc', 'desc')
    .default('asc')
    .messages({
      'any.only': 'El orden debe ser asc o desc'
    })
    .optional(),

  search: Joi
    .string()
    .trim()
    .min(1)
    .max(100)
    .messages({
      'string.min': 'La búsqueda no puede estar vacía',
      'string.max': 'La búsqueda no puede tener más de 100 caracteres'
    })
    .optional(),
})

export { ValidationCreateGrade, ValidationGradeParams }