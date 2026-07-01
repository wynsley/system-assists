import Joi from "joi"

const INCIDENT_TYPES = ["LEVE", "GRAVE", "MUY_GRAVE"];

const ValidationCreateIncidentCatalog = Joi.object({
  name: Joi
    .string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El nombre de la categoría de incidente es requerido',
      'string.min': 'El nombre de la categoría de incidente debe tener mínimo 3 caracteres',
      'string.max': 'El nombre de la categoría de incidente no puede tener más de 50 caracteres',
      'any.required': 'El nombre de la categoría de incidente es requerido'
    }),

  description: Joi
    .string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'La descripción de la categoría de incidente es requerida',
      'string.min': 'La descripción de la categoría de incidente debe tener mínimo 3 caracteres',
      'string.max': 'La descripción de la categoría de incidente no puede tener más de 100 caracteres',
      'any.required': 'La descripción de la categoría de incidente es requerida'
    }),

  type: Joi
    .string()
    .valid(...INCIDENT_TYPES)
    .required()
    .messages({
      'any.only': `El tipo de incidente debe ser ${INCIDENT_TYPES.join(', ')}`,
      'string.empty': 'El tipo de incidente es requerido',
      'any.required': 'El tipo de incidente es requerido'
    }),

  pointsDeducted: Joi
    .number()
    .integer()
    .min(1)
    .max(100)
    .required()
    .messages({
      'number.base': 'Los puntos a deducir deben ser un número',
      'number.integer': 'Los puntos a deducir deben ser un número entero',
      'number.min': 'Los puntos a deducir deben ser mayor o igual a 1',
      'number.max': 'Los puntos a deducir no pueden ser mayor a 100',
      'any.required': 'Los puntos a deducir son requeridos'
    }),
})

export { ValidationCreateIncidentCatalog }